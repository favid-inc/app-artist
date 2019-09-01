import { Order } from '@favid-inc/api';
import { ARTIST_UPLOAD_DIRECTORY, FulfillOrder } from '@favid-inc/api/lib/app-artist';
import { apiClient } from '@src/core/utils/apiClient';
import * as firebase from 'firebase';

export type Canceler = () => void;
export type CancelToken = (canceler: Canceler) => void;
export type ProgressHandler = (percentage: number) => void;
export type ProgressPublisher = (current: number, total: number) => void;

type Response = Promise<FulfillOrder['Response']>;

export async function fufillOrder(order: Order, cancelToken: CancelToken, onProgress: ProgressHandler): Response {
  const cancelFlag = new CancelFlag();

  const progressPublisher = new MultiProgressRacePublisher(onProgress);

  const [videoUri, videoThumbnailUri] = await Promise.race([
    new Promise<string[]>((resolve, reject) => {
      cancelToken(() => {
        cancelFlag.cancel();
        reject();
      });
    }),
    Promise.all([
      uploadFile(order.videoUri, progressPublisher.getPublisher()),
      uploadFile(order.videoThumbnailUri, progressPublisher.getPublisher()),
    ]),
  ]);

  const request: FulfillOrder['Request'] = {
    url: '/FulfillOrder',
    method: 'POST',
    data: {
      id: order.id,
      videoUri,
      videoThumbnailUri,
    },
  };

  const response = await apiClient.request<FulfillOrder['Response']>({
    ...request,
  });

  return response.data;

  async function uploadFile(uri: string, publisher: ProgressPublisher): Promise<string> {
    try {
      const filename = uri.split('/').pop();

      const directory: ARTIST_UPLOAD_DIRECTORY = 'Artist/:userUid/temporary';

      const destination = `${directory.replace(':userUid', firebase.auth().currentUser.uid)}/${filename}`;

      const blob = await fileUriToBlob(uri);

      const task = firebase
        .storage()
        .ref(destination)
        .put(blob);

      return await new Promise((resolve, reject) => {
        task.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          (snapshot) => {
            if (cancelFlag.isCanceled) {
              task.cancel();
              return;
            }
            publisher(snapshot.bytesTransferred, snapshot.totalBytes);
          },
          (e) => reject(e),
          () => resolve(filename),
        );
      });
    } catch (e) {
      cancelFlag.cancel();
      throw e;
    }
  }

  async function fileUriToBlob(uri: string) {
    return await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = () => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  }
}

class CancelFlag {
  private state: boolean = false;
  public cancel() {
    this.state = true;
  }
  public get isCanceled() {
    return this.state;
  }
}

class MultiProgressRacePublisher {
  private handler: ProgressHandler;
  private progress: Array<{ current: number; total: number }> = [];

  constructor(handler: ProgressHandler) {
    this.handler = handler;
  }

  public getPublisher(): ProgressPublisher {
    const idx = this.progress.length;
    this.progress.push({ current: 0, total: 0 });
    return (current, total) => {
      this.progress[idx] = { current, total };
      this.publish();
    };
  }

  private publish() {
    const total = this.progress.reduce((s, p) => s + p.total, 0);

    if (!total) {
      this.handler(0);
    }

    const current = this.progress.reduce((s, p) => s + p.current, 0);

    this.handler(Math.round((current / total) * 100));
  }
}

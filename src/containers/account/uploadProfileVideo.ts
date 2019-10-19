import { ARTIST_UPLOAD_DIRECTORY, UploadProfileVideo } from '@favid-inc/api/lib/app-artist';
import { apiClient } from '@src/core/utils/apiClient';
import * as firebase from 'firebase';

export type Canceler = () => void;
export type CancelToken = (canceler: Canceler) => void;
export type ProgressHandler = (percentage: number) => void;
export type ProgressPublisher = (current: number, total: number) => void;

type Response = Promise<UploadProfileVideo['Response']>;

export async function uploadProfileVideo(uri: string, cancelToken: CancelToken, onProgress: ProgressHandler): Response {
  const cancelFlag = new CancelFlag();

  const videoUri = await Promise.race([
    new Promise<string>((resolve, reject) => {
      cancelToken(() => {
        cancelFlag.cancel();
        reject();
      });
    }),
    uploadFile(),
  ]);

  const request: UploadProfileVideo['Request'] = {
    url: '/UploadProfileVideo',
    method: 'POST',
    data: { videoUri },
  };

  const response = await apiClient.request<UploadProfileVideo['Response']>(request);

  return response.data;

  async function uploadFile(): Promise<string> {
    try {
      const filename = uri.split('/').pop();

      const destination = `${ARTIST_UPLOAD_DIRECTORY.replace(':userUid', firebase.auth().currentUser.uid)}/${filename}`;

      const blob = await fileUriToBlob();

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
            onProgress(snapshot.totalBytes ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) : 0);
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

  async function fileUriToBlob() {
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

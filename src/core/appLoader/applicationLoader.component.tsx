import { LoadingAnimationComponent } from '@src/core/appLoader/loadingAnimation.component';
import { AppLoading, SplashScreen } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { ImageRequireSource } from 'react-native';

export interface Assets {
  images: ImageRequireSource[];
  fonts: { [key: string]: number };
}

interface Props {
  assets: Assets;
  children: React.ReactNode;
}

interface State {
  loaded: boolean;
}

type LoadingElement = React.ReactElement<{}>;

/**
 * Loads child component after asynchronous tasks are done
 */
export class ApplicationLoader extends React.Component<Props, State> {
  public state: State = {
    loaded: false,
  };

  constructor(props: Props) {
    super(props);
    SplashScreen.preventAutoHide();
  }

  public render() {
    return (
      <>
        {this.state.loaded ? this.props.children : this.renderLoading()}
        <LoadingAnimationComponent isLoaded={this.state.loaded} />
      </>
    );
  }

  private onLoadSuccess = () => {
    this.setState({ loaded: true });
    SplashScreen.hide();
  };

  private onLoadError = (error: Error) => {
    // console.warn(error);
  };

  private loadResources = (): Promise<void> => {
    return this.loadResourcesAsync(this.props.assets);
  };

  private loadFonts = (fonts: { [key: string]: number }): Promise<void> => {
    return Font.loadAsync(fonts);
  };

  private loadImages = async (images: ImageRequireSource[]): Promise<void> => {
    await Promise.all(
      images.map(async (image) => {
        await Asset.fromModule(image).downloadAsync();
      }),
    );
  };

  private async loadResourcesAsync(assets: Assets): Promise<void> {
    const { fonts, images } = assets;
    await Promise.all([this.loadFonts(fonts), this.loadImages(images)]);
  }

  private renderLoading = (): LoadingElement => {
    return (
      <AppLoading
        startAsync={this.loadResources}
        onFinish={this.onLoadSuccess}
        onError={this.onLoadError}
        autoHideSplash={false}
      />
    );
  };
}

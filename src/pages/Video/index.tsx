import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export class VideoPlayer extends React.Component {
  private videoRef: React.RefObject<HTMLVideoElement>;
  private player: any;

  constructor(props: any) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.player = videojs(this.videoRef.current, this.props, () => {
      console.log('video player ready');
    });
  }

  componentWillUnmount() {
    this.player && this.player.dispose();
  }

  render() {
    return (
      <div data-vjs-player>
        <video ref={this.videoRef} className="video-js"></video>
      </div>
    );
  }
}

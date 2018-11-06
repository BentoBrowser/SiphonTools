import ElementAnnotation from './element_annotation'

function capture(video, scaleFactor) {
	if(scaleFactor == null){
		scaleFactor = 1;
	}
	var w = video.videoWidth * scaleFactor;
	var h = video.videoHeight * scaleFactor;
	var canvas = document.createElement('canvas');
		canvas.width  = w;
	  canvas.height = h;
	var ctx = canvas.getContext('2d');
		ctx.drawImage(video, 0, 0, w, h);
    return canvas;
}

export default class Video extends ElementAnnotation{

  constructor(videoNode) {
    super(videoNode); //TODO Facebook
    var url = new URL(window.location.href)
    if (url.host.endsWith("youtube.com") && url.pathname.match(/\/watch/)) {
      this.video_id = url.searchParams.get("v")
      this.provider = "youtube"
      this.thumbnail = `https://img.youtube.com/vi/${this.video_id}/1.jpg`
    } else if (url.host.endsWith("dailymotion.com") && url.pathname.match(/\/video\/([a-z0-9]+)/)) {
      this.video_id = url.pathname.match(/\/video\/([a-z0-9]+)/)[1]
      this.provider = "dailymotion"
      this.thumbnail = `https://www.dailymotion.com/thumbnail/video/${this.video_id}`
    } else if (url.host.endsWith("vimeo.com") && url.pathname.match(/([0-9]+)$/)) {
      let path = url.pathname.split("/")
      this.video_id = path[path.length - 1]
      this.provider = "vimeo"
      this.thumbnail = `https://i.vimeocdn.com/video/${this.video_id}_640.jpg`
    } else if (url.host.endsWith("wistia.com") && url.pathname.match(/\/medias\/([a-z0-9]+)/)) {
      this.video_id = path[path.length - 1]
      this.provider = "wistia"
      this.thumbnail = `http://embed.wistia.com/deliveries/${video.video_id}.jpg `
    } else if (url.host.endsWith("twitch.tv")) {
      this.video_id = path[path.length - 1] //Note will only be numeric when just a video
      this.provider = url.pathname.contains("videos/")? "twitch_video" : "twitch_live"
			//Unfortunately doesn't work because of HTML5 restrictions :(((
			//videoNode.crossOrigin = "Anonymous";
      //this.thumbnail = capture(videoNode, 500 / Math.max(videoNode.videoWidth, videoNode.videoHeight)).toDataURL('image/jpeg')
    } else {
      //Use our html5 capture to make a data url for the thumbnail instead
			//videoNode.crossOrigin = "Anonymous";
      //this.thumbnail = capture(videoNode, 500 / Math.max(videoNode.videoWidth, videoNode.videoHeight)).toDataURL('image/jpeg')
    }
    this.src = videoNode.src
  }

  serialize() {
    let save = super.serialize()
    Object.assign(save, {src: this.src, video_id: this.video_id, provider: this.provider})
    return save;
  }

  deserialize(serialized) {
    super.deserialize(serialized)
    this.src = serialized.src
    this.video_id = serialized.video_id
    this.provider = serialized.provider
  }

  mark() {
    if (this.element) {
      this.element.classList.add(`siphon-video`)
      this.element.classList.add(`siphon-annotation-${this.key}`);
    }
  }

  unmark() {
    if (this.element)
      this.element.classList.remove(`siphon-video`)
      this.element.classList.remove(`siphon-annotation-${this.key}`)
  }
}

import ElementAnnotation from './element_annotation';
function capture(video, scaleFactor) {
    if (scaleFactor == null) {
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (ctx)
        ctx.drawImage(video, 0, 0, w, h);
    return canvas;
}
export default class Video extends ElementAnnotation {
    constructor(videoNode) {
        super(videoNode); //TODO Facebook
        this.videoId = "";
        this.provider = "";
        this.thumbnail = "";
        var url = new URL(window.location.href);
        if (url.host.endsWith("youtube.com") && url.pathname.match(/\/watch/)) {
            this.videoId = url.searchParams.get("v");
            this.provider = "youtube";
            this.thumbnail = `https://img.youtube.com/vi/${this.videoId}/1.jpg`;
        }
        else if (url.host.endsWith("dailymotion.com") && url.pathname.match(/\/video\/([a-z0-9]+)/)) {
            let match = url.pathname.match(/\/video\/([a-z0-9]+)/);
            this.videoId = (match) ? match[1] : "";
            this.provider = "dailymotion";
            this.thumbnail = `https://www.dailymotion.com/thumbnail/video/${this.videoId}`;
        }
        else if (url.host.endsWith("vimeo.com") && url.pathname.match(/([0-9]+)$/)) {
            let path = url.pathname.split("/");
            this.videoId = path[path.length - 1];
            this.provider = "vimeo";
            this.thumbnail = `https://i.vimeocdn.com/video/${this.videoId}_640.jpg`;
        }
        else if (url.host.endsWith("wistia.com") && url.pathname.match(/\/medias\/([a-z0-9]+)/)) {
            let path = url.pathname.split("/");
            this.videoId = path[path.length - 1];
            this.provider = "wistia";
            this.thumbnail = `http://embed.wistia.com/deliveries/${this.videoId}.jpg `;
        }
        else if (url.host.endsWith("twitch.tv")) {
            let path = url.pathname.split("/");
            this.videoId = path[path.length - 1]; //Note will only be numeric when just a video
            this.provider = url.pathname.includes("videos/") ? "twitch_video" : "twitch_live";
            //Unfortunately doesn't work because of HTML5 restrictions :(((
            //videoNode.crossOrigin = "Anonymous";
            //this.thumbnail = capture(videoNode, 500 / Math.max(videoNode.videoWidth, videoNode.videoHeight)).toDataURL('image/jpeg')
        }
        else {
            //Use our html5 capture to make a data url for the thumbnail instead
            //videoNode.crossOrigin = "Anonymous";
            //this.thumbnail = capture(videoNode, 500 / Math.max(videoNode.videoWidth, videoNode.videoHeight)).toDataURL('image/jpeg')
        }
        this.src = videoNode.src;
    }
    serialize() {
        let save = super.serialize();
        return Object.assign(save, { src: this.src, video_id: this.videoId, provider: this.provider, thumbnail: this.thumbnail });
    }
    deserialize(serialized) {
        super.deserialize(serialized);
        this.src = serialized.src;
        this.videoId = serialized.video_id;
        this.provider = serialized.provider;
    }
    mark() {
        if (this.element) {
            this.element.classList.add(`siphon-video`);
            this.element.classList.add(`siphon-annotation-${this.key}`);
        }
    }
    unmark() {
        if (this.element)
            this.element.classList.remove(`siphon-video`);
        this.element.classList.remove(`siphon-annotation-${this.key}`);
    }
}
//# sourceMappingURL=video_annotation.js.map
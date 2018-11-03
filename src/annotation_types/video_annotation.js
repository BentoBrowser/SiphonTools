import ElementAnnotation from './element_annotation'

export default class Video extends ElementAnnotation{

  constructor(videoNode) {
    super(videoNode);
    var url = new URL(window.location.href)
    if (url.host.includes("youtube.com") && url.pathname.match(/\/watch/)) {
      this.video_id = url.searchParams.get("v")
      this.provider = "youtube"
    } else if (url.host.includes("dailymotion.com") && url.pathname.match(/\/video\/([a-z0-9]+)/)) {
      this.video_id = url.pathname.match(/\/video\/([a-z0-9]+)/)[1]
      this.provider = "dailymotion"
    } else if (url.host.includes("vimeo.com") && url.pathname.match(/([0-9]+)$/)) {
      let path = url.pathname.split("/")
      this.video_id = path[path.length - 1]
      this.provider = "vimeo"
    } else if (videoNode.src.startsWith("blob:")) {
      //If we have a blob video, and we can't directly use the source with our video renderer, try and
      //run it through streamable
      let url = `https://api.streamable.com/import?url=${window.location.href}`;
      let username = 'kitturlab';
      let password = 'testpassword123';
      let headers = new Headers();

      headers.append('Authorization', 'Basic' + btoa(username + ":" + password));
      fetch(url, {method:'GET', headers: headers}).then(resp => {
        return resp.json()
      }).then(json => {
        this.provider = "streamable"
        this.video_id = json.shortcode
      }).catch(err => {
        //Throw error here about unsupported video
      })

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

class Playback{

  constructor(){
    const list = [
      {
        title: 'test',
        uri: 'testUri',
        duration: 5
      }
    ];
    this.addSong = (songObject) => {
      const title = songObject.title;
      const uri = songObject.uri;
      const duration = songObject.duration;

      list.push(
        {
          title,
          uri,
          duration
        }
      );
      return true;
    };
    this.getList = () => {
      return list.concat();
    };
    this.getLength = () => {
      return list.length;
    };
  }
}

module.exports = Playback;

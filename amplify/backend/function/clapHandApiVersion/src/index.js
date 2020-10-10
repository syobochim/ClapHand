exports.handler = async (event, context) => {
    const VERSION = "1.0.0"
    var latestRelease = {
        version: VERSION,
        url: "http://example.com/ClapHand.app.zip",
        name: "ClapHand for Desktop " + VERSION,
        notes: "- プロキシ認証\n- ウィンドウメニューの表示\n- パフォーマンスの改善"
      };
     
      if (event.version < VERSION) {
        context.done(null, latestRelease);
      } else {
        context.done("Not Modified");
      }
};

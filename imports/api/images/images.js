export const Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images")]
});

Images.allow({
  'update': function () {
    return true;
  },
  'download': function(userId) {
  	return true;
  },

  'insert': function () {
    return true;
  }
});
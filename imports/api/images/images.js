import { FS } from 'meteor/cfs:base-package';


export const Images = new FS.Collection('images', {
  stores: [new FS.Store.FileSystem("images")],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.allow({
  'update'() {
    return true;
  },

  'download'() {
    return true;
  },

  'insert'() {
    return true;
  },
});

const {Story} = require("@quintype/framework/server/api-client");

exports.loadStoryPageData = function loadStoryPageData(client,  params, config){
  return Story.getStoryBySlug(client, params.storySlug)
    .then(story => ({
      story: story.asJson(),
      cacheKeys: story.cacheKeys(config['publisher-id'])
    }));
}

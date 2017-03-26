'use strict'

const activityApi = require('src/api/activity')
const timesliceApi = require('src/api/timeslice')

module.exports = (relations) => (resolve, options) => {
  return Promise.all([
    activityApi.fetchAll(options),
    timesliceApi.fetchAll(options)
  ]).then(function ([activities, timeslices]) {
    resolve(timeslices.map(timeslice => {
      const activity = activities.find((activity) => (activity.id === timeslice.activity_id))
      if (activity) {
        timeslice.activity = activity
        ;['customer', 'project', 'service'].forEach(relationName => {
          timeslice.activity[relationName] = relations[relationName].find((item) => (
            item.id === timeslice.activity[relationName + '_id']
          ))
        })
        timeslice.tags = timeslice.activity.tags
          .map(tagId => relations['tag'].find(tag => tag.id === tagId))
        return timeslice
      }
    }).filter(timeslice => timeslice))
  })
}

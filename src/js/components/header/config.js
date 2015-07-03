'use strict';

module.exports = {
  title: "Pimp my dime",
  children: {
    name: {
      title: 'Application name',
      name: 'general/customize/header/name',
      type: 'text',
      defaultValue: 'Dime Timetracker'
    },
    icon: {
      title: 'Application icon',
      name: 'general/customize/header/icon',
      type: 'text',
      defaultValue: 'icon-access-time'
    },
    color: {
      title: 'Header color',
      description: 'Change header color (red)',
      name: 'general/customize/header/color',
      type: 'text',
      defaultValue: 'green'
    }
  }
};
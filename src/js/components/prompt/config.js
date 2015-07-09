'use strict';

module.exports = {
  title: 'Prompt',
  description: 'Prompt settings',
  children: {
    shortcuts: {
      title: 'Shortcuts',
      description: 'Keyboard shortcuts',
      children: {
        focusPrompt: {
          title: 'Focus prompt',
          description: 'Press this key to focus prompt',
          namespace: 'prompt',
          name: 'shortcuts/focusPrompt',
          type: 'text',
          defaultValue: 'mod+a'
        },
        submitPrompt: {
          title: 'Submit prompt',
          description: 'Press this key to submit prompt',
          namespace: 'prompt',
          name: 'shortcuts/submitPrompt',
          type: 'text',
          defaultValue: 'enter'
        },
        blurPrompt: {
          title: 'Blur prompt',
          description: 'Press this key to blur prompt',
          namespace: 'prompt',
          name: 'shortcuts/blurPrompt',
          type: 'text',
          defaultValue: 'esc'
        },
        triggerAutocompletion: {
          title: 'Trigger autocompletion',
          description: 'Press this key to trigger prompt autocompletion',
          namespace: 'prompt',
          name: 'shortcuts/triggerAutocompletion',
          type: 'text',
          defaultValue: 'tab'
        },
        cycleSuggestionsLeft: {
          title: 'Cycle suggestions',
          description: 'Press this key to cycle suggestions of prompt autocompletion',
          namespace: 'prompt',
          name: 'shortcuts/cycleSuggestionsLeft',
          type: 'text',
          defaultValue: 'left'
        },
        cycleSuggestionsRight: {
          title: 'Cycle suggestions',
          description: 'Press this key to cycle suggestions of prompt autocompletion',
          namespace: 'prompt',
          name: 'shortcuts/cycleSuggestionsRight',
          type: 'text',
          defaultValue: 'right'
        },
        focusFilter: {
          title: 'Focus filter',
          description: 'Press this key to focus filter',
          namespace: 'prompt',
          name: 'shortcuts/focusFilter',
          type: 'text',
          defaultValue: 'd f'
        }
      }
    }
  }
};

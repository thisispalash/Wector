**CHANGELOG**
================

See new features added to Wector and reflected on the published extension.

- For a user friendly change log, see [New Features](https://github.com/khaaliDimaag/Wector/blob/master/mkdwn/CHANGE.md "Changelog for Users").
- For complete commit history, see [Commits](https://github.com/khaaliDimaag/Wector/commits "Commit History").

> v 1.0.0
>> Initial Release of [Wector Chrome Extension](https://chrome.google.com/webstore/detail/fnhndnmiikmadhdpfajepacocmeaikde "See on the Chrome Webstore").

> v 1.0.1
>> Fixed BUG: (Temporary solution) Bar always showed up, annoying users. Solution: The bar hides on click. It reappears when the page is reloaded.

> v 1.0.2
>> Fixed BUG: Options page opened automatically on every update. Fixed by checking for reason of install in [backgroud.js](https://github.com/khaaliDimaag/Wector/commit/8f3106d30e37bb2475c54015b30dc4dea36fdbd6#diff-99e282bfd699d9216408244ef482df6a "See change").

> v 1.0.3
>>
- Fixed BUG: Wector's CSS IDs and classes caused change in layout on websites. Fixed by changing names in [content.css](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-238175df7f8b5f8ff0ecb210b7064619 "See change") and [content_script.js](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193a "See change").
- Fixed BUG: Wector's bar would be dismissed and would not show until page page was reloaded. Fixed by changing onClick event listeners to `address` and `info` `<div>`s in lines [314](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193aR314 "See change"), [315](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193aR315 "See change"), [337](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193aR337 "See change"), and [338](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193aR338 "See change") of [content_script.js](https://github.com/khaaliDimaag/Wector/commit/6b6fe4f7f4cabf8fd9b0efce27a10b820ae412cb#diff-38d45d4b8390f2e44ce64c261829193a "See change").

* * *

See new features added to the [Wector.ml](http://wector.ml "Visit us!").

- For a user friendly change log, see [New Features](https://github.com/khaaliDimaag/Wector/blob/master/mkdwn/CHANGE.md "Changelog for Users").
- For complete commit history, see [Commits](https://github.com/khaaliDimaag/Wector/commits "Commit History").

> v 1.0.0
>> Initial release of [Wector](http://wector.ml "Visit us!").

> v 1.1.0
>> Improved the demo on [Wector](http://wector.ml "Check it out!") to include context-aware locations based on the user's location, instead of standard locations. Added [nearby.php](https://github.com/khaaliDimaag/Wector/commit/3be3435d05a95bf2d681ba39c948f5cbec09ae41#diff-9c1f9343faf0dbed8785062aa36c77e1 "See change") to query Google's [Places API Web Service](https://developers.google.com/places/webservice/ "Check it out!").

>> Added color rotation to the Add to Chrome button in [use.html](https://github.com/khaaliDimaag/Wector/commit/3be3435d05a95bf2d681ba39c948f5cbec09ae41#diff-765cbd3ed9223af7bed943ed8ae101cf "See change").

> v 1.1.1
>> Added error messages for non-PC and non-Chrome users, when they try to install the extension through the 'Add to Chrome' buttons. Changes made to the buttons on [main.html](https://github.com/khaaliDimaag/Wector/commit/f5148ca03b6d6ac043eb53f1d51c48047482abb5#diff-09a9b01308685cccc534d2fc6de5e952 "See change") and [use.html](https://github.com/khaaliDimaag/Wector/commit/f5148ca03b6d6ac043eb53f1d51c48047482abb5#diff-765cbd3ed9223af7bed943ed8ae101cf "See change")

* * *

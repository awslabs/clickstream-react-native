/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */
import { ClickstreamAnalytics } from '../index';

describe('ModuleNotLinked test', () => {
  test('test init SDK when native module unlinked', async () => {
    try {
      await ClickstreamAnalytics.init({
        appId: 'testAppId',
        endpoint: 'https://example.com/collect',
      });
      fail('test failed, should throw linking error');
    } catch (error) {
      expect((error as any).message).toContain(
        "The package 'clickstream-react-native' doesn't seem to be linked"
      );
    }
  });
});

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

export interface ClickstreamConfiguration extends Configuration {
  appId: string;
  endpoint: string;
  readonly sendEventsInterval?: number;
  readonly sessionTimeoutDuration?: number;
  readonly globalAttributes?: ClickstreamAttribute;
}

export interface Configuration {
  appId?: string;
  endpoint?: string;
  isLogEvents?: boolean;
  isCompressEvents?: boolean;
  authCookie?: string;
  isTrackScreenViewEvents?: boolean;
  isTrackUserEngagementEvents?: boolean;
  isTrackAppExceptionEvents?: boolean;
}

export interface ClickstreamAttribute {
  [key: string]: string | number | boolean;
}

export interface Item {
  id: string;
  name?: string;
  location_id?: string;
  brand?: string;
  currency?: string;
  price?: number;
  quantity?: number;
  creative_name?: string;
  creative_slot?: string;
  category?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  category5?: string;

  [key: string]: string | number | boolean | undefined;
}

export interface ClickstreamEvent {
  name: string;
  attributes?: ClickstreamAttribute;
  items?: Item[];
}

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

export enum Event {
  SCREEN_VIEW = '_screen_view',
}

export enum Attr {
  SCREEN_NAME = '_screen_name',
  SCREEN_UNIQUE_ID = '_screen_unique_id',
  TRAFFIC_SOURCE_SOURCE = '_traffic_source_source',
  TRAFFIC_SOURCE_MEDIUM = '_traffic_source_medium',
  TRAFFIC_SOURCE_CAMPAIGN = '_traffic_source_campaign',
  TRAFFIC_SOURCE_CAMPAIGN_ID = '_traffic_source_campaign_id',
  TRAFFIC_SOURCE_TERM = '_traffic_source_term',
  TRAFFIC_SOURCE_CONTENT = '_traffic_source_content',
  TRAFFIC_SOURCE_CLID = '_traffic_source_clid',
  TRAFFIC_SOURCE_CLID_PLATFORM = '_traffic_source_clid_platform',
  APP_INSTALL_CHANNEL = '_app_install_channel',
  VALUE = '_value',
  CURRENCY = '_currency',
}

export interface ClickstreamAttribute {
  [Attr.SCREEN_NAME]?: string;
  [Attr.SCREEN_UNIQUE_ID]?: string;
  [Attr.TRAFFIC_SOURCE_SOURCE]?: string;
  [Attr.TRAFFIC_SOURCE_MEDIUM]?: string;
  [Attr.TRAFFIC_SOURCE_CAMPAIGN]?: string;
  [Attr.TRAFFIC_SOURCE_CAMPAIGN_ID]?: string;
  [Attr.TRAFFIC_SOURCE_TERM]?: string;
  [Attr.TRAFFIC_SOURCE_CONTENT]?: string;
  [Attr.TRAFFIC_SOURCE_CLID]?: string;
  [Attr.TRAFFIC_SOURCE_CLID_PLATFORM]?: string;
  [Attr.APP_INSTALL_CHANNEL]?: string;
  [Attr.VALUE]?: number;
  [Attr.CURRENCY]?: string;

  [key: string]: string | number | boolean | undefined;
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

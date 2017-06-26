/*
 * Copyright 2017  IBM Corp.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */


const username = '{Username}';
const password = '{Password}';
const tenantId = '{Tenant ID}';

const baseTenantApiUrl = 'https://{Hostname}/api/' + tenantId;

const wchLoginURL = baseTenantApiUrl + '/login/v1/basicauth';
const contextualSearchServiceApiUrl = baseTenantApiUrl + '/delivery/v1/contextualsearch';
const searchServiceApiUrl = baseTenantApiUrl + '/delivery/v1/search';
const resourceServiceApiUrl = baseTenantApiUrl + '/delivery/v1/resources/';

var loggedIn = true;

function loginToWch(callback) {
    console.log('Trying to login');
    var loginRequestOptions = {
        xhrFields: {
            withCredentials: true
        },
        url: wchLoginURL,
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password)
        }
    };
    $.ajax(loginRequestOptions).done(function() {
        loggedIn = true;
        if (callback) {
            callback();
        }
    }).fail(function(request, textStatus, error) {
        alert('Could not login to Watson Content Hub with error : ' + error);
    });
}

function getSearchQueryforSourceImages() {
    return searchServiceApiUrl + '?q=*:*&fq=assetType:image&rows=999';
}

function searchSourceImages(callback) {
    if (!loggedIn) {
        loginToWch(function() {
            _searchImages();
        });
    } else {
        _searchImages();
    }
    function _searchImages() {
        var sourceImagesSearchUrl =  getSearchQueryforSourceImages();
        console.log('Retrieving the source images from search via : ' + sourceImagesSearchUrl);
        var contextualSearchRequestOptions = {
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            url: sourceImagesSearchUrl
        };
        $.ajax(contextualSearchRequestOptions).done(function(response) {
            callback(response);
        }).fail(function(request, textStatus, error) {
            alert('Could not search from Watson Content Hub with error : ' + error);
        });
    }
}


function getContextualSearchQuery(currentSourceId) {
    return contextualSearchServiceApiUrl + '?filter=similar&similar-source-id=' + currentSourceId + '&similar-source-classification=asset'
        + '&fq=assetType:image&q=*:*&fl=name,tags,id,resource&rows=100';
}

function similarSearch(imageId, callback) {
    if (!loggedIn) {
        loginToWch(function() {
            _similarSearch();
        });
    } else {
        _similarSearch();
    }
    function _similarSearch() {
        // the contextual search similar filter requires the items uuid.
        var imageUUId = _getItemUUID(imageId);
        var similarSearchUrl = getContextualSearchQuery(imageUUId);
        console.log('Retrieving the content from contextual search via : ' + similarSearchUrl);
        var contextualSearchRequestOptions = {
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            url: similarSearchUrl
        };
        $.ajax(contextualSearchRequestOptions).done(function(response) {
            callback(response);
        }).fail(function(request, textStatus, error) {
            alert('Could not search from Watson Content Hub with error : ' + error );
        });
    }
}

function _getItemUUID(imageId) {
    // authoring search item id is of form classification:uuid
    // delivery search item id is of form uuid
    var idArray = imageId.split(':');
    var imgUuid;
    // 2 means this is an authoring search id
    if(idArray.length === 2){
        imgUuid = idArray[1];
    } else {
        imgUuid = idArray[0];
    }
    return imgUuid;
}

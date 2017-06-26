/*
 * Copyright 2017  IBM Corp.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

const MATCHED_HTML_ID_PREFIX = 'matched:';
const SOURCE_HTML_ID_PREFIX = 'source:';
var currentlySelectedSourceImageTags;
var sourceImagesSearchItems;
var matchedImagesSimilarSearchItems;

function buildSourceImageTable(sourceImagesSearchResponse){
    console.log('buildSourceImageTable ' + sourceImagesSearchResponse);
    sourceImagesSearchItems = sourceImagesSearchResponse;
    var sourceImagesTable = document.getElementById('source-table');
    sourceImagesTable.innerHTML = '';
    clearTagsTable('source-tags');
    clearImagesTable('matched-table');
    clearTagsTable('matched-tags');
    buildTagsTableNoImage('source-tags', 'No image selected');
    var rows = (sourceImagesSearchItems.length / 5) + 1;
    console.log('rows '+rows);
    var cells = 0;
    for(var i = 0;  (i < rows && cells < sourceImagesSearchItems.length) ; i++) {
        var tr = document.createElement('tr');
        for(var j = 0;  (j < 5 && cells < sourceImagesSearchItems.length) ; j++) {
            var td = createSourceImageCell(sourceImagesSearchItems[cells]);
            tr.appendChild(td);
            cells++;
        }
        sourceImagesTable.appendChild(tr);
    }
}

function createSourceImageCell(sourceImageJson){
    var td = createImageCell(sourceImageJson, SOURCE_HTML_ID_PREFIX);
    var imageElem = td.children[0];
    imageElem.addEventListener("click", function( event ) {
        var sourceItemSearchId = event.target.id.substring(SOURCE_HTML_ID_PREFIX.length);
        makeThisImageOnlySelected(event.target.id, 'source-table');
        clearTagsTable('source-tags');
        clearImagesTable('matched-table');
        clearTagsTable('matched-tags');
        if (buildTagsTable(false, 'source-tags', sourceImagesSearchItems, 'Source image has no tags.', sourceItemSearchId)) {
          updateUIQueryStringWithItemUUID(sourceItemSearchId);
          invokeSimilarImageSearch(sourceItemSearchId);
        }
    }, false);
    return td;
}

function createImageCell(imageJson, htmlIdPrefix) {
    var td = document.createElement('td');
    td.className = 'imageCell';
    var imageElem = new Image(100, 100);
    var imageId = imageJson.id;
    var resourceId = imageJson.resource;
    imageElem.id = htmlIdPrefix + imageId;
    imageElem.src = resourceServiceApiUrl + resourceId;
    td.appendChild(imageElem);
    return td;
}

function buildMatchedImageTable(similarSearchMatchedImagesResponse){
    console.log('buildMatchedImageTable ' + similarSearchMatchedImagesResponse);
    matchedImagesSimilarSearchItems = similarSearchMatchedImagesResponse;
    var matchedImagesTable = document.getElementById('matched-table');
    clearImagesTable('matched-table');
    clearTagsTable('matched-tags');
    buildTagsTableNoImage('matched-tags', 'No image selected');
    var rows = (matchedImagesSimilarSearchItems.length / 5) + 1;
    console.log('rows '+rows);
    var cells = 0;
    for(var i = 0; (i < rows && cells < matchedImagesSimilarSearchItems.length) ; i++) {
        var tr = document.createElement('tr');
        for(var j = 0; (j < 5 && cells < matchedImagesSimilarSearchItems.length) ; j++) {
            var td = createMatchedImageCell(matchedImagesSimilarSearchItems[cells]);
            tr.appendChild(td);
            cells++;
        }
        matchedImagesTable.appendChild(tr);
    }
}

function createMatchedImageCell(sourceMatchedJson){
    var td = createImageCell(sourceMatchedJson, MATCHED_HTML_ID_PREFIX);
    var imageElem = td.children[0];
    imageElem.addEventListener("click", function( event ) {
        var matchedItemSearchId = event.target.id.substring(MATCHED_HTML_ID_PREFIX.length);
        makeThisImageOnlySelected(event.target.id, 'matched-table');
        clearTagsTable('matched-tags');
        buildTagsTable(true ,'matched-tags', matchedImagesSimilarSearchItems, 'The matched image had no tags. if fl is used, \'tags\' must be an included field',  matchedItemSearchId);
    }, false);
    td.appendChild(imageElem);
    return td;
}

function buildImageTableNoImages(imagesTableId, messageString, tagsTableId){
    console.log('buildMatchedImageTableNoMatches');
    var matchedImagesTable = document.getElementById(imagesTableId);
    clearImagesTable(imagesTableId);
    clearTagsTable(tagsTableId);
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var span = document.createElement('span');
    span.className = 'messageText';
    span.appendChild(document.createTextNode(messageString));
    td.appendChild(span);
    tr.appendChild(td);
    matchedImagesTable.appendChild(tr);
}

function clearImagesTable(tableId){
    var imagesTable = document.getElementById(tableId);
    imagesTable.innerHTML = '';
}

function buildTagsTable(matched, tableId, imagesSearchItems, emptyString,  imgId) {
    console.log('buildTagsTable ' + imgId);
    var tagsDiv = document.getElementById(tableId);
    var foundImageSearchItem;
    for (var i = 0; i <= imagesSearchItems.length; i++) {
        var imageSearchItem = imagesSearchItems[i];
        if (imageSearchItem && imageSearchItem.id === imgId) {
            if (!matched) {
                currentlySelectedSourceImageTags = imageSearchItem.tags;
            }
            foundImageSearchItem = imageSearchItem;
            break;
        }
    }
    if(foundImageSearchItem.tags && foundImageSearchItem.tags.length > 0) {
        for (var j = 0; j < foundImageSearchItem.tags.length; j++) {
            var button = document.createElement('button');
            if(matched && matchedTagValueInSourceTags(foundImageSearchItem.tags[j])) {
                button.className = 'matchedTagText';
            } else {
                button.className = 'normalTagText';
            }
            button.appendChild(document.createTextNode(foundImageSearchItem.tags[j]));
            tagsDiv.appendChild(button);
        }
    } else {
        var span = document.createElement('span');
        span.appendChild(document.createTextNode(emptyString));
        span.className = 'messageText';
        tagsDiv.appendChild(span);
        return false;
    }
    return true;
}

function buildTagsTableNoImage(areaID, messageText) {
    console.log('buildTagsTableNoImage');
    var matchedTagsDiv = document.getElementById(areaID);
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(messageText));
    span.className = 'messageText';
    matchedTagsDiv.appendChild(span);
}

function clearTagsTable(tableId){
    var matchedTagsDiv = document.getElementById(tableId);
    matchedTagsDiv.innerHTML = '';
}

function matchedTagValueInSourceTags(matchedTagValue) {
    for (var j = 0; j < currentlySelectedSourceImageTags.length; j++) {
        if (currentlySelectedSourceImageTags[j] === matchedTagValue) {
            return true;
        }
    }
    return false;
}

function updateUIQueryStringWithItemUUID(imgId){
    console.log('updateUIQueryStringWithItemUUID '+imgId);
    document.getElementById('sample-search-source-id').textContent = _getItemUUID(imgId);
}

function makeThisImageOnlySelected(imageId, tableId) {
    var matchedImagesTable = document.getElementById(tableId);
    for (var i = 0; i < matchedImagesTable.children.length; i++) {
        var row = matchedImagesTable.childNodes[i];
        for (var j = 0; j < row.children.length; j++) {
            var img = row.children[j].children[0];
            if(img.id !== imageId) {
                img.className = '';
            } else {
                img.className = 'selectedImage';
            }
        }
    }
}
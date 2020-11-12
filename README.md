# Sample similarity search using the Contextual Search Service API

This sample shows the similar (tags) search capability of Acoustic Content (formerly Watson Content Hub or WCH) contextual search service.
This technical sample is intended for developers who want to explore the Acoustic Content APIs and the data model.  

The sample illustrates:
- The use of similar search provided by contextual search service to search for images whose tags match a specified image.  
 
  
### Exploring the Watson Content Hub similar search API capabilities

The contextual search service provides the functionality to filter search results based on items with similar tags.   

The contextual search parameters can be started along with the basic Solr query to further enhance the search results based on the user's current conditions.

Currently, contextual search provides the following three custom filters:
- **accept-language** - This filter along with basic search parameters can be used to search documents based on the current user's request preferred language.  
[Click here for public github repository for locale sample.](https://github.com/acoustic-content-samples/sample-contextual-locale-search)
- **proximity** - This filter along with basic search parameters can be used to search documents with location information within a specific proximity from the specified center-point or the user's current position.  
[Click here for public github repository for proximity sample.](https://github.com/acoustic-content-samples/sample-contextual-proximity-search)
- **similar** - This filter along with basic search parameters can be used to search documents with similar (that is, one or more matching) tags to the item with the 
specified ID (uuid) assigned to the `similar-source-id` parameter and specified classification assigned to the `similar-source-classification` parameter. The source item can be a content item, asset, etc.
The filter does not impose any restriction on what items can be matched. For example, you can search for images that have similar tags to a specified content item, or 
search for content items that have similar tags to a specified content item, etc.  
  
An example of a `similar` query is  
`?q=*:*&filter=similar&similar-source-id=abc-123-abc&similar-source-classification:asset&fq=assetType:images`  
This query searches all images, which have one or more of the same tags as the asset whose ID is abc-123-abc.
The type of the returned items, `images`, is specified by the value on the `fq` parameter.  
  
Another example of a `similar` query is  
`?q=*:*&filter=similar&similar-source-id=abc-123-def&similar-source-classification:content&fq=assetType:video`  
This query searches all videos, which have one or more of the same tags as the content item whose ID is abc-123-def.
The type of the returned items, `video`, is specified by the value on the `fq` parameter.  
  
Another example of a `similar` query is  
`?q=*:*&filter=similar&similar-source-id=abc-123-def&similar-source-classification:asset&fq=type:Article`  
This query searches all content items of content type `Article`, which have one or more of the same tags as the asset whose ID is abc-123-def.
The type of the returned items, `Article`, is specified by the value on the `fq` parameter. 

This sample covers only the `similar` filter.

### Setting up the sample

For running the sample, your tenant must have some sample data with tags specified.

You can find some sample images that can be uploaded in `similarImageSearchSampleData.zip`. 
This zip file includes images with various types of tags, user specified tags, Watson concept tags, and some tags that are embedded in the image metadata.

#### Prerequisites

- Watson Content Hub account.

#### 1. Download the files

Download the project files into any folder on your workstation.

#### 2. Update the WCH tenant information

This sample uses a hardcoded base API URL, update the base API URL in `/public/wchClient.js` file.

To set the variables for the base API URL for your tenant, you can obtain the variables Content hub ID and Hostname from the WCH user interface.
In the IBM Watson Content Hub user interface, open the "Hub information" dialog from the "About" flyout menu in the left navigation pane. A pop-up window displays the tenant's Watson Content Hub ID, API URL, and Hostname.

For example, the base API URL is similar to:  
const baseTenantUrl = "https://content-eu-4.content-cms.com/api/12345678-9abc-def0-1234-56789abcdef0";

#### 3. Enable CORS support for your tenant

To use this sample, you need to enable CORS support for your tenant. To control the CORS enablement for Watson Content Hub, go to Hub Set up -> General settings -> Security tab. Add your domain (or "*" for any domain) and click Save.

#### 4. Starting the sample

- Open `/public/similarImageSearch.html` in a browser.  
  
  
#### Assigning user tags to items  

You can assign user tags to items by following the steps that are outlined here:

- Log in to the Watson Content Hub.

- You can set the tag for the content item or asset (image) by selecting the `tags` twistie on the right side-bar and clicking the `Add tag` link while `creating` or `editing` a content item or asset.

### Exploring the sample
The sample enables the `similar` filter. All the results returned are filtered based on the tags that are found in the source item.  

To try out the sample:  

- Click a displayed source image. The sample uses the standard search API in WCH to obtain a list of the images for this tenant. Using this list the sample code builds a simple UI
 that displays the images. Clicking one of those images causes three things to happen:  
  1) The image is highlighted and the tags for that image are displayed. 
  2) A call to the Content Search Service is made with the `similar` filter, specifying the ID (through `similar-source-id`) and classification 
  (through `similar-source-classification`) of the item. The classification that is used for the sample is `asset`.
  This API call returns a list of image search entries that have one or more tags that match with the source item. 
  The type of the items in the returned list is specified with the `fq` value in the URL and for the sample with `assetType:image`.   
  3) The results of the search are displayed in the 'Query Results' window.   
 
- Clicking an image in the results window highlights the image and display its tags in the area below it. 
   Any tags, that match the source image, are displayed with bold text with an underline.  
  
  
 ![Screen shot of Similar Search Sample](/doc/sample-screenshot.png?raw=true "Screen shot of Similar Search Sample")
  
  
### Running the sample by using the Authoring contextual search service
The sample is coded to use the Delivery contextual search service by default.
To update the sample to use the Authoring contextual search service, update the `/public/wchClient.js` file with the following changes to enable authentication.
1. Change this line  
var loggedIn = true;  
to  
var loggedIn = false;  
  
2. Change this line  
const contextualSearchServiceApiUrl = baseTenantApiUrl + '/delivery/v1/contextualsearch';  
to  
const contextualSearchServiceApiUrl = baseTenantApiUrl + '/authoring/v1/contextualsearch';  
  
3. Change this line  
const searchServiceApiUrl = baseTenantApiUrl + '/delivery/v1/search';    
to    
const searchServiceApiUrl = baseTenantApiUrl + '/authoring/v1/search';  
  
4. Change this line  
const resourceServiceApiUrl = baseTenantApiUrl + '/delivery/v1/resources/';  
to  
const resourceServiceApiUrl = baseTenantApiUrl + '/authoring/v1/resources/';  
  
5. Update `username` and `password` variables with your login details  for authentication.  

## Resources

Acoustic Content developer documentation: https://developer.goacoustic.com/acoustic-content/docs

Acoustic Content API reference documentation: https://developer.goacoustic.com/acoustic-content/reference

Acoustic Content Samples Gallery: https://content-samples.goacoustic.com/

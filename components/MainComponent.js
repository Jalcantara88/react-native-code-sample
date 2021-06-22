
import React, { Component, useEffect, useState } from 'react';
import { data } from 'browserslist';



function xmlToJson(xml) {
    
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                //obj['node_c_data'] = attribute.data;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
};

function Main() {
    /*
    constructor(props) {
        super(props);
        this.state = {
            allIssues : [],
            renderedImages: ""
        }
        */

        const [allIssues, setAllIssues] = useState([]);
        const [renderedImages, setRenderedImages] = useState("");

        //fetch call to api from comic vine website
        fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=65c3e7b3c65af20fbfe03bb5d0cd0b8e83e9fb1a').then(response => response.text())
        .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
        .then(data => {
            var json = xmlToJson(data);
            const issueNodeList = data.querySelectorAll("issue");
            const newArray = Array.from(issueNodeList);
            console.log(newArray[0].querySelector("image").querySelector("thumb_url").childNodes[0].data);

            //var issuesArray = Array.from(data);
            //console.log("issues array is: " + issuesArray.toString());
            //console.log(json.response.results.issue);
            //this.setState({allIssues: json.response.results.issue});
            //this.setState({allIssues: newArray});
            setAllIssues(newArray);
        })
        .catch((error) => {
            console.error(error);
        });
    

    useEffect(() => {
        const allrenderedImages = allIssues.forEach(item => {
            const imageSrc = item.querySelector("image").querySelector("thumb_url").childNodes[0].data
            //console.log(imageSrc);
            return(
                <>
                    <img src={imageSrc}/>
                </>
            );
        });
        //this.setState({renderedImages: allrenderedImages});
        setRenderedImages(allrenderedImages);
    });

    
    

    
    
    //render() {

        
        //console.log(this.state.allIssues);
        return (<>
        {renderedImages}
        </>);
    //}
}

export default Main;
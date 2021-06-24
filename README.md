# React Native Code Sample
![app preview](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/appPreview.PNG)

Depoyed Site [HERE](https://react-native-code-sample.netlify.app/)

#### This code sample uses React Native to showcase:
####     - `Animate`-ing an `Image` using an `PNG`
####     - Making an `API` call
####     - Paginating `API` request with `Button`s
####     - Using `Flatlist` with custom `View`


### Animating an Image using an PNG
from: [MainComponent.js](components/MainComponent.js)

This is to render this spinning loading icon
<br/>
![animated loading icon](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/spinner.PNG)

1. `Animated` value held in variable `spinValue
`var spinValue = new Animated.Value(0);`

2. Set up animation `loop` with `timing` function. 
```
// First set up animation 
Animated.loop(
    Animated.timing(
        spinValue,
    {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear, // Easing is an additional import from react-native
        useNativeDriver: true  // To make use of native driver for performance
    }
    )).start()
```

3. `spin` holds the interpolated values from `spinValue` for a 360 spin.
```
const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg']
});
```

4. Created `Animated.Image` element with path to spinner
`<Animated.Image style={styles.spinner} source={require("../assets/Spinner.png")}/>`

5. Passed in `spin` to the `transform` attribute of the `Image` element
```
spinner: {
    width: "200px",
    height: "200px",
    transform: [{rotate: spin}]
}
```

5. This animated spinner is shown conditionally only when "loading"
```
if(this.state.isLoading) {
    return(
        <View>
            <Animated.Image style={styles.spinner} source={require("../assets/Spinner.png")}/>
        </View>
    )
}
```

### Making an API call
from: [MainComponent.js](components/MainComponent.js)

This is to make an API call to [Comic Vine API](https://comicvine.gamespot.com/api/) and store an array from within the response. 

1. Get your own API key from [Comic Vine API](https://comicvine.gamespot.com/api/)

2. Make a `FUNCTION` that uses an asynchronous fetch call and stores
```
apiCall() {
    //fetch call to api from comic vine website using proxy to get around cors - with api key
    fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=<YOUR API KEY>=json')
    //turn response into json
    .then(response => 
        response.json()
    )
    .then(data => {
        //for looking at object structure
        console.log(data);
        this.setState({totalResults: data.number_of_total_results});
        //store results in array
        const newArray = data.results;
        //update state with array
        this.setState({allIssues: newArray});
        //once info is stored we can change isloading to false to render data
        this.setState({isLoading: false});
    })
    //catch any errors
    .catch((error) => {
        console.error(error);
    });
}
```

3. This returns an array taken from the `results` sub object `json` object received as response. This is now stored in `this.state.allIssues`
![json response object](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/apiResponse.PNG)

### Pagination of API request with Buttons
from: [MainComponent.js](components/MainComponent.js)

This is to iterate through a paginated `json` response.
Comic Vine limits the `response` to only hold 100 items in the `results` array. But by passing in an `offset` value on the `api` call.

1. There is a `state` value in `MainComponent` that holds the offset value.
`apiOffset: 0`

2. The `apiCall` `function` has a `parameter` of `ofset`
`apiCall(offset) {`

3. On the `fetch` call there is the `offest` added to the end of the string with the required `&offset=` before it. There is also a proxy link prepended to the `api` address to get around the `cors` issues.
`
fetch('https://proxy-cors-anywhere.herokuapp.com/https://www.comicvine.com/api/issues?api_key=<YOUR API KEY>=json&offset=' + offset)
`

4. There are 2 buttons that alter the `offset` value using `setState`.
![offset buttons](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/buttons.PNG)

`onPress` sets the `state`'s offset to  add or subtract 100 depending on button pressed. Then it fires a new `api` call passing in the new offset. I used `useState`'s second parameter to make sure things happened sequentially because of the asynchronous calls.
```
<Button
    onPress={() => {
        //set new ofset value then pass that into api call function on second param
        var newNum = this.state.apiOffset - 100;
        this.setState({apiOffset: newNum}, () => {
            this.setState({isLoading: true});
            this.apiCall(this.state.apiOffset);
        });
    }}
    disabled={this.state.apiOffset === 0 ? true : false}
    title="prev"
/>
<Button
    onPress={() => {
        //set new ofset value then pass that into api call function on second param
        var newNum = this.state.apiOffset + 100;
        this.setState({apiOffset: newNum}, () => {
            this.setState({isLoading: true});
            this.apiCall(this.state.apiOffset);
        });
    }}
    title="next"
/>
```
It also sets the `isLoading` value to true to show the loading animation while we wait for the reaponse. I also made sure to `disable` the prev `Button` if the current `offset` is `0` since we cant make an `api` call with a negative `offset`.

5. It also shows total results and current viewing window based on `array` `object` structure of `allIssues`.


### Using FlatList with custom View
from: [CustomView.js](components/CustomView.js)

This uses `FlatList` with a custom render method to display the comic book results.
<br/>
![rendered item](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/customRender.PNG)

1. Created custom render method. This takes in paramaters to grab in `name`, `image_url`, `issue`, and `link` to display them as you see in the picture.
```
const CustomView = ({name, image_url, issue, link, year}) => {
    return(
        <>
            {/*basic card view*/}
            <View style={styles.resultHolder} >
                <Image source={{uri: image_url}} style={styles.image}/>
                {/*Info Display*/}
                <View style={styles.containerText}>
                    {/*Name*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>name: </Text>
                        <Text style={styles.detail}>
                            {name}
                        </Text>
                    </View>
                    {/*Issue Number*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>issue #: </Text>
                        <Text style={styles.detail}>
                            {issue}
                        </Text>
                    </View>
                    {/*Year Released*/}
                    <View style={styles.labelGroup}>
                        <Text style={styles.label}>year: </Text>
                        <Text style={styles.detail}>
                            {year}
                        </Text>
                    </View>
                    {/*open link to comicVine website showcasing this issue*/}
                    <Text style={styles.linkButton} onPress={() => Linking.openURL(link)}>
                        MORE DETAILS
                    </Text>
                </View>
            </View>
        </>
    );
}
```
 The link also uses `Linking.openUrl` as a hyperlink.

 2. Created custom View. This uses `FlatList` to iterate through `itemList` with the custom render method in to its `renderItem` parameter.
```
const CustomListView = ({itemList}) => {
    return(
    <View style={styles.issuesHolder}>
        {/*Use flatlist to call CustomView on every item of itemList*/}
        <FlatList
            keyExtractor={item => item.id.toString()}
            data={itemList}
            renderItem={({item}) => {
                return(
                    //call custom render method
                <CustomView
                    name={item.volume.name}
                    image_url={item.image.original_url}
                    issue={item.issue_number}
                    link={item.site_detail_url}
                    year={item.cover_date ? item.cover_date : "N/A"}
                />
                )
            }}
        />
    </View>
)}
```
This is where `CustomView` component is fed in the info from `itemList`.

3. Render the `CustomViewList`. Fed in `allIssues` from `state` into `itemList`.
```
<CustomListView 
    itemList={this.state.allIssues}  
/>
```

4. This is the structure of each object in allIssues.

![array structure](https://github.com/Jalcantara88/react-native-code-sample/blob/main/assets/readme/arrayStructure.PNG) 

## Setting Up Locally

first either fork and clone or just clone this repo in to local machine

cd into main folder of project

to install all dependencies listed in `package.json` run:
```
yarn
```

to get the app working in a local environment run:
```
yarn start
```

this will get expo running in your browser.

you can then run on your phone, or in your web browser. enjoy.

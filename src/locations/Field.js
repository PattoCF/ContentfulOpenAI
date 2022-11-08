import React from "react";
import {
  Stack,
  FormControl,
  TextInput,
  Button,
} from "@contentful/f36-components";
import RenderImages from "../components/renderImages";
//import { FieldExtensionSDK } from '@contentful/app-sdk';
//import { useCMA, useSDK } from '@contentful/react-apps-toolkit';
//import RenderImages from '../components/renderImages';

/*

- config page
-- how many picture to show
-- API key
- dimenions 

- Field level app
- type (new picture or outpainting) --> not sure if available via API yet

-- text box to submit request
-- type of request (oil painting, etc.)
-- show based on config x number of pictures 

- user selects on or many images? 
- create asset(s) based on URL 

- present to SE/PS/Demo team 

*/

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  //use config here
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export default class Fields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urls: undefined, //array mit URLs, dann unten map
      prompt: undefined,
      openai: undefined,
    };
    this.makeOpenAiCall = this.makeOpenAiCall.bind(this);
  }
  makeOpenAiCall = async () => {
    let fieldPrompt = document.getElementById("openaiPrompt");

    let openaiResponse = await openai.createImage({
      prompt: fieldPrompt.value, //"A cute baby sea otter",
      //use config here
      n: 2,
      size: "1024x1024",
    });

    if (openaiResponse !== this.state.openai) {
      let helperArray = [];
      debugger;
      openaiResponse.data.data.forEach((url) => {
        helperArray.push(url);
      });

      this.setState({
        urls: helperArray,
        prompt: fieldPrompt.value,
        openai: openaiResponse,
      });
    }
  };

  //cma = useCMA;

  render = () => {
    //if(this.state.openai === undefined) this.response()
    return (
      <div stye="min-height:500px">
        <Stack>
          <FormControl isRequired>
            <FormControl.Label>OpenAI Prompt to create image</FormControl.Label>
            <TextInput
              type="text"
              id="openaiPrompt"
              name="openaiPrompt"
              placeholder="Please specify your image"
            />
          </FormControl>
          <Button variant="primary" onClick={this.makeOpenAiCall}>
            Generate
          </Button>
        </Stack>
        <RenderImages urls={this.state.urls} />
      </div>
    );
  };
}

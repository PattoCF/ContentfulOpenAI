import React, { useCallback, useState, useEffect } from "react";
import { AppExtensionSDK } from "@contentful/app-sdk";
import {
  FormControl,
  Heading,
  Card,
  Tabs,
  Stack,
  TextInput,
  Select
} from "@contentful/f36-components";
import { Paragraph } from "@contentful/f36-typography";
//import tokens from '@contentful/f36-tokens';

//import { css } from 'emotion';
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";

export interface AppInstallationParameters {
    apiKey?: string;
    items?: number;
    dimension?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({
      apiKey: "",
      items: 1,
      dimension: "",
  });
  const sdk = useSDK<AppExtensionSDK>();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    //check field values
    
    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null =
        await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Card style={{ maxWidth: "50em", margin: "3em auto" }}>
      <img
        src="https://openai.com/content/images/2022/05/twitter-1.png"
        alt="Open AI"
        style={{ height: "5em", display: "block" }}
      />

      <Tabs defaultTab="first">
        <Tabs.List>
          <Tabs.Tab panelId="first">Features</Tabs.Tab>
          <Tabs.Tab panelId="second">Configuration</Tabs.Tab>
          <Tabs.Tab panelId="third">Feedback</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="first">
          <Heading marginTop="spacingS" as="h3">
            Features include
          </Heading>
          <ul>
            <li>Generate Images using OpenAI</li>
            <li>Select image(s) and save as Asset inside Contentful</li>
          </ul>
        </Tabs.Panel>
        <Tabs.Panel id="second">
          <Heading marginTop="spacingS" as="h3">
            Configuration
          </Heading>

          <Stack flexDirection="column" alignItems="left">
            <FormControl isRequired isInvalid={!parameters.apiKey}>
              <FormControl.Label>API Key</FormControl.Label>
              <TextInput
                value={parameters.apiKey}
                name="apikey"
                type="password"
                placeholder="Your Dall-e API Key"
                onChange={(e) => setParameters({...parameters, apiKey : e.target.value })}
              />
              <FormControl.HelpText>
                Provide your Dall-e API Key
              </FormControl.HelpText>
              {!parameters.apiKey && (
                <FormControl.ValidationMessage>
                  Please, provide your API Key
                </FormControl.ValidationMessage>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!parameters.apiKey}>
              <FormControl.Label>Items to display</FormControl.Label>

              <TextInput
                value={parameters.items?.toString()}
                type="text"
                name="numberOfElements"
                placeholder="How many elements should be returned from Open AI"
                onChange={(e) =>
                  setParameters({...parameters, items: Number(e.target.value) })
                }
              />
              <FormControl.HelpText>
                Specify the number of images that should be generated
              </FormControl.HelpText>
              {!parameters.items && (
                <FormControl.ValidationMessage>
                  Please, specify the number of items
                </FormControl.ValidationMessage>
              )}
            </FormControl>
            <FormControl.Label>Select the dimension</FormControl.Label>


              <Select
                id="optionSelect-dimension"
                name="dimension"
                value={parameters.dimension}
                
                onChange={(event) => setParameters({...parameters, dimension: event.target.value })}
              >
                  <Select.Option value="1024x1024">1024x1024</Select.Option>
                  <Select.Option value="512x512">512x512</Select.Option>

                <Select.Option value="256x256">256x256</Select.Option>

              </Select>
              
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel id="third">
          <Heading marginTop="spacingS" as="h3">
            Questions or comments?
          </Heading>
          <Paragraph>
            Please reach out to{" "}
            <a href="mailto:patrick.geers@contentful.com">Patrick Geers</a> or{" "}
            <a href="mailto:dheeraj.palagiri@contentful.com">
              Dheeraj Palagiri
            </a>
            .
          </Paragraph>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
};

export default ConfigScreen;

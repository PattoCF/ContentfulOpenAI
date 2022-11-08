import React, { useCallback, useState, useEffect } from 'react';
import { AppExtensionSDK } from '@contentful/app-sdk';
import { Heading, Card,Tabs, Grid, TextInput } from '@contentful/f36-components';
import { Paragraph } from '@contentful/f36-typography';
//import tokens from '@contentful/f36-tokens';

//import { css } from 'emotion';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';

export interface AppInstallationParameters {}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
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
      parameters : {
        openaiApiKey: 'abc',
        numberOfElments: '2',
        size: '1024x1024'

      },
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
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

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
        
        <Tabs defaultTab='first'>
      <Tabs.List>
        <Tabs.Tab panelId="first">Features</Tabs.Tab>
        <Tabs.Tab panelId="second">Configuration</Tabs.Tab>
        <Tabs.Tab panelId="third">Feedback</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel id="first">
        <Heading marginTop='spacingS' as="h3">Features include</Heading>
        <ul>
          <li>Field Level App</li>
          <li>Allows submitting a query to openAI</li>
          <li>Select generated image and save to openAI</li>
        </ul>
      </Tabs.Panel>
      <Tabs.Panel id="second">
        <Heading marginTop='spacingS' as="h3">Configuration</Heading>
        <Grid
      style={{ width: '100%' }}
      columns="1fr 2fr"
      rowGap="spacingM"
      columnGap="spacingM"
    >
      <Grid.Item><Paragraph>Open AI API Key</Paragraph></Grid.Item>
      <Grid.Item>
       
        <TextInput
          //value={this.parameters.openaiApiKey===undefined?'':''}
          type="text"
          name="openaiApiKey"
          placeholder="Provide your Open AI API Key"
        />
       
    </Grid.Item>
      <Grid.Item><Paragraph>How many itms to display?</Paragraph></Grid.Item>

      <TextInput
          //value={this.parameters.openaiApiKey===undefined?'':this.parameters.openaiApiKey}
          type="text"
          name="numberOfElements"
          placeholder="How many elements should be returned from Open AI"
        />
      <Grid.Item><Paragraph>Dimensions</Paragraph></Grid.Item>
      <Grid.Item>
      <TextInput
          //value={this.parameters.openaiApiKey===undefined?'':this.parameters.openaiApiKey}
          type="text"
          name="dimension"
          placeholder="Specify the dimensions"
        />

      </Grid.Item>
    </Grid>
      </Tabs.Panel>
      <Tabs.Panel id="third">
        <Heading marginTop='spacingS' as="h3">Questions or comments?</Heading>
        <Paragraph>Please reach out to <a href="mailto:patrick.geers@contentful.com">Patrick Geers</a> or <a href="mailto:dheeraj.palagiri@contentful.com">Dheeraj Palagiri
  </a>.</Paragraph>
      </Tabs.Panel>
    </Tabs>
        
      </Card>
  );
};

export default ConfigScreen;

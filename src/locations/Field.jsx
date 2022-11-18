import React, { useState } from "react";
import {
  Button,
  TextInput,
  FormControl,
  Grid,
} from "@contentful/f36-components";
import { /*useCMA,*/ useSDK } from "@contentful/react-apps-toolkit";
import { MultipleMediaEditor } from "@contentful/field-editor-reference";

const Field = () => {
  const sdk = useSDK();
  const [value, setValue] = useState("");
  //is generating should be true aka button disabled when
  //max items has been reached
  const [isGenerating, setIsGenerating] = useState(false);
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: sdk.parameters.installation.apiKey,
  });
  const openai = new OpenAIApi(configuration);

  const makeOpenAiCall = async () => {
    setIsGenerating(true);

    let fieldPrompt = document.getElementById("openaiPrompt");
    let openaiResponse = await openai.createImage({
      prompt: fieldPrompt.value,
      n: sdk.parameters.installation.items,
      size: sdk.parameters.installation.dimension,
    });
    sdk.dialogs
      .openCurrent({
        title: "Generate OpenAI Images",
        id: "dialog",
        width: "fullWidth",
        minHeight: 700,
        position: "top",
        shouldCloseOnEscapePress: true,
        shouldCloseOnOverlayClick: true,
        allowHeightOverflow: true,
        parameters: {
          urls: openaiResponse.data.data,
          prompt: fieldPrompt.value,
        },
      })
      .then((data) => {
        setIsGenerating(false);

        let helper = [];
        for (let i = 0; i < data.length; i++) {
          let sysInfo = {
            sys: {
              type: "Link",
              linkType: "Asset",
              id: "",
            },
          };
          sysInfo.sys.id = data[i];

          helper.push(sysInfo);
        }

        if (
          sdk.field.getValue() !== undefined &&
          sdk.field.getValue().length > 0
        ) {
          sdk.field.setValue(helper.concat(sdk.field.getValue()));
        } else {
          sdk.field.setValue(helper);
        }

        setIsGenerating(false);
      });
  };

  sdk.window.updateHeight(320);

  return (
    <div>
      <Grid
        style={{ width: "100%" }}
        columns="2fr 1fr"
        rowGap="spacingM"
        columnGap="spacingM"
      >
        <Grid.Item>
          <FormControl isInvalid={value.length < 3}>
            <TextInput
              type="text"
              id="openaiPrompt"
              name="openaiPrompt"
              size="medium"
              placeholder="Please specify your image"
              onChange={(e) => setValue(e.target.value)}
            />
            {value.length < 3 && (
              <FormControl.ValidationMessage>
                Please, provide at least 3 characters
              </FormControl.ValidationMessage>
            )}
          </FormControl>
        </Grid.Item>
        <Grid.Item>
          <Button
            className="mediumButton"
            id="submitButton"
            onClick={makeOpenAiCall}
            variant="primary"
            isLoading={isGenerating}
            isDisabled={value.length < 3 || isGenerating}
          >
            {" "}
            Generate Images
          </Button>
        </Grid.Item>
      </Grid>
      {
        <MultipleMediaEditor
          viewType="card"
          parameters={{
            instance: {
              showCreateEntityAction: false,
              showLinkEntityAction: true,
              bulkEditing: false,
            },
          }}
          sdk={sdk}
          isInitiallyDisabled={true}
          hasCardMoveAction={false}
          hasCardRemoveAction={false}
        ></MultipleMediaEditor>
      }
    </div>
  );
};

export default Field;

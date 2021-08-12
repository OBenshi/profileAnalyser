import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
  MouseEvent,
  TouchEvent,
} from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_DATING } from "../GraphQL/Mutations";
import { TONE_OF_TEXT } from "../GraphQL/Queries";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      width: 360,
      margin: `${theme.spacing(0)} auto`,
    },
  })
);
interface IAddText {
  owner: string;
  text: string;
  postDate: string;
  display: boolean;
  private: boolean;
}

const AddText: React.FC = (props) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const classes = useStyles();
  const [AddDatingTextMutation, { error: addTextErr }] =
    useMutation(ADD_DATING);

  const [datingText, setDatingText] = useState<IAddText>({
    owner: "610aab87b019d20496f334c8",
    text: "",
    postDate: new Date().toISOString(),
    private: false,
    display: true,
  });
  const [submit, setSubmit] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);
  const [textAnal, setTextAnal] = React.useState<string>("");
  const {
    loading: toneLoading,
    data: toneData,
    refetch: toneRefetch,
    error: toneErr,
  } = useQuery(TONE_OF_TEXT, {
    variables: {
      aToneText: textAnal,
    },
  });
  const [buttonNum, setButtonNum] = useState<number>(1);

  const handleChange = (e: ChangeEvent<any>): void =>
    setDatingText({ ...datingText, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    console.log(toneData);
    console.log(datingText);
    try {
      // await AddDatingTextMutation({
      //   variables: {
      //     addDatingTextText: {
      //       owner: datingText.owner,
      //       text: datingText.text,
      //       postDate: datingText.postDate,
      //       xprivate: datingText.private,
      //       display: datingText.display,
      //       toneResults: toneData.aTone,
      //     },
      //   },
      // });
      console.log("text was uploaded");
    } catch (err) {
      if (addTextErr) {
        console.log(addTextErr);
      }
      console.log(`err`, err);
    }

    console.log(datingText.text);
  };

  // const handleAnalyze = async () => {
  //   // e.preventDefault();
  //   // e.stopPropagation();

  //   setTextAnal(datingText.text);

  //   console.log(999, textAnal);
  //   // await toneRefetch();
  //   console.log(toneData, 666);
  // };
  useEffect(() => {
    // console.log(`toneData from Ue`, toneData);
    // console.log(`datingText.text===''`, datingText.text === "");
  }, [toneData]);
  useEffect(() => {
    // console.log(`toneData from Ue`, toneData);
    submit && handleSubmit();
    // console.log(`datingText.text===''`, datingText.text === "");
  }, [submit]);

  return (
    <div>
      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        style={{ backgroundColor: " white" }}
        // onSubmit={handleSubmit}
      >
        <TextareaAutosize
          aria-label="minimum height"
          minRows={10}
          placeholder="Add your own dating text here and click upload"
          name="text"
          value={datingText.text}
          onChange={handleChange}
        />
        {/* <FormControlLabel
        control={
          <Checkbox
            name="xprivate"
            color="primary"
            value={datingText.private}
            onChange={handleChange}
          />
        }
            label="Private"
                />  */}
        <KeyboardDatePicker
          margin="normal"
          id="date-picker-dialog"
          label="Todays date"
          format="MM/dd/yyyy"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          type="button"
          name="update_button2"
          onClick={async (e) => {
            setTextAnal(datingText.text);
          }}
        >
          Let's analyze your text
        </Button>
        {/* {data !== undefined && props.aTone} */}
        {textAnal !== "" &&
          (toneData?.aTone && Object.keys(toneData.aTone).length !== 0 ? (
            Object.entries(toneData.aTone).map(([key, value]) => (
              <p>
                {key}:{value}
              </p>
            ))
          ) : !toneLoading ? (
            <p>text too short</p>
          ) : (
            <p>loading</p>
          ))}
        {/* {!toneData ? <p>no data</p> : <p>data</p>} */}
        <Button
          variant="contained"
          color="primary"
          type="button"
          name="update_button"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            setTextAnal(datingText.text);
            setSubmit(true);
            await toneData.aTone;
          }}
        >
          Upload your text
        </Button>{" "}
      </form>
    </div>
  );
};

export default AddText;

///TODO watson and edit your dating text.

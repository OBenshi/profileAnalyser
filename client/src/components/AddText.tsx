import React, {
  useState,
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
import Typography from '@material-ui/core/Typography';
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
  const {
    loading,
    data: toneData,
    refetch: toneRefetch,
    error: toneErr,
  } = useQuery(TONE_OF_TEXT, {
    variables: {
      aToneText: datingText.text,
    },
  });

  const handleChange = (e: ChangeEvent<any>): void =>
    setDatingText({ ...datingText, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(datingText);
    await AddDatingTextMutation({
      variables: {
        addDatingTextText: {
          owner: datingText.owner,
          text: datingText.text,
          postDate: datingText.postDate,
          xprivate: datingText.private,
          display: datingText.display,
          toneResults: { Joy: 0.737 },
        },
      },
    });
    if (addTextErr) {
      console.log(addTextErr);
    } else {
      console.log("text was uploaded");
    }
    console.log(datingText.text);
  };
  const handleAnalyze = async (e: PointerEvent | MouseEvent<any>) => {
    e.preventDefault();

    try {
      await toneRefetch();
      console.log(
        `toneData`,
        Object.prototype.toString
          .call(toneData.aTone)
          .slice(8, -1)
          .toLowerCase()
      );
    } catch (err) {
      console.log(`e`, err, toneErr);
    }
  };
  useEffect(() => {
    console.log(`data`, toneData);
  }, []);
  return (
    <div>
      <form
        className={classes.container}
        noValidate
        autoComplete="off"
        style={{ backgroundColor: " white" }}
        onSubmit={handleSubmit}
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
        <br></br>
        <Button
          variant="contained"
          color="primary"
          type="button"
          onClick={(e) => {
            handleAnalyze(e);
          }}
        >
          <Typography>
          Analyze your text
          </Typography>
        </Button>
        {/* {data !== undefined && props.aTone} */}
        <Button variant="contained" color="primary" type="submit">
          <Typography>
          Upload your text
          </Typography>
        </Button>
      </form>
    </div>
  );
};

export default AddText;

///TODO watson and edit your dating text.

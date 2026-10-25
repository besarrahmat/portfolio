import { Progress } from "@base-ui/react/progress";

type ProgressBarProps = {
  label: string;
  /** 0–100; null = indeterminate (size unknown). */
  value: number | null;
};

// Determinate progress of an upload. The value is read out as a percentage next to the label.
export function ProgressBar({ label, value }: ProgressBarProps) {
  return (
    <Progress.Root value={value} className="ui-progress">
      <span className="ui-progress__head">
        <Progress.Label className="ui-progress__label">{label}</Progress.Label>
        <Progress.Value className="ui-progress__value figure" />
      </span>
      <Progress.Track className="ui-progress__track">
        <Progress.Indicator className="ui-progress__indicator" />
      </Progress.Track>
    </Progress.Root>
  );
}

// Indeterminate wait inside a control. The caller names what is happening for screen readers.
export function Spinner({ label }: { label?: string }) {
  return (
    <span className="ui-spinner">
      <span aria-hidden="true" />
      {label && (
        <span className="ui-visually-hidden" role="status">
          {label}
        </span>
      )}
    </span>
  );
}

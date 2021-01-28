export type ErrorMessageProps = {
  error?: Error;
};

export default function ErrorMessage({ error }) {
  return <div>{error == null ? null : error.message}</div>;
}

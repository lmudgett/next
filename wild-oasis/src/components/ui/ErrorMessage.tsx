// Shared fallback shown when a page's server data fails to load.
type ErrorMessageProps = {
  resource: string;
  message?: string;
};

export const ErrorMessage = ({ resource, message }: ErrorMessageProps) => (
  <p>
    Sorry, there was a problem loading the {resource}. Please contact the admin:
    {message && <pre>{message}</pre>}
  </p>
);

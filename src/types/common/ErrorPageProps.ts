type ErrorPageProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default ErrorPageProps;
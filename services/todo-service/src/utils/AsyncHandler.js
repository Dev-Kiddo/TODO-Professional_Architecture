export default function AsyncHandler(handerFn) {
  return (req, res, next) => {
    return Promise.resolve(handerFn(req, res, next)).catch(next);
  };
}

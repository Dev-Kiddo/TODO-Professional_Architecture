export default function AsyncHandler(handlerFn) {
  return (req, res, next) => {
    return Promise.resolve(handlerFn(req, res, next)).catch(next);
  };
}

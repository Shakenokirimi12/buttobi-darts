const Start = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const long = query.get("long");
  const alt = query.get("alt");
  return <div>Start</div>;
};

export default Start;

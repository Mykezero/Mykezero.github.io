function redirectHttps()
{
  // No redirect for localhost
  if (window.location.host.startsWith("127.0.0.1") || window.location.host.startsWith("localhost"))
    return;

  // Redirect to https
  if(window.location.protocol != "https:")
    window.location.protocol = "https";
}

redirectHttps();

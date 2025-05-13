const theme = nodecg.bundleConfig.theme;

switch (theme) {
  case 'red':
    import('./themes/red.theme.css');
    break;
  case 'green':
    import('./themes/green.theme.css');
    break;
  case 'blue':
    import('./themes/blue.theme.css');
    break;
}

fetch('./Storage/info.json')
  .then((info) => info.json())
  .then(({ nMembers, nServers, nCommands }) => {
    document.getElementById('nMembers').innerHTML = nMembers;
    document.getElementById('nServers').innerHTML = nServers;
    document.getElementById('nCommands').innerHTML = nCommands;
  });

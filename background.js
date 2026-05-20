const PR_URL_RE = /^https?:\/\/github\.com\/([^\/?#]+)\/([^\/?#]+)\/pull\/(\d+)/;

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "github.com",
              pathContains: "/pull/",
            },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ]);
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  let url = tab.url;
  if (!url) {
    const [active] = await chrome.tabs.query({ active: true, currentWindow: true });
    url = active?.url;
  }
  if (!url) return;

  const match = url.match(PR_URL_RE);
  if (!match) return;

  const [, owner, repo, number] = match;
  chrome.tabs.create({
    url: `https://diffshub.com/${owner}/${repo}/pull/${number}`,
    index: (tab.index ?? 0) + 1,
    active: true,
  });
});

// Copy link function

function copyLink() {
    // Get the article URL from the data attribute
    var articleUrl = document.getElementById('copyLinkButton').getAttribute('data-article-url');

    // Create a temporary input element
    var tempInput = document.createElement('input');
    tempInput.value = articleUrl;
    document.body.appendChild(tempInput);

    // Select the input field and copy its value to the clipboard
    tempInput.select();
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    // Get the copy link button element
    var copyLinkButton = document.getElementById('copyLinkButton');

    // Change the button color
    copyLinkButton.classList.add('btn-copied');

    // Show the "Link Copied" message on the page
    var messageElement = document.createElement('div');
    messageElement.innerHTML = 'Link copied!';
    messageElement.classList.add('copy-message');
    copyLinkButton.parentNode.insertBefore(messageElement, copyLinkButton.nextSibling);

    // Revert changes after a few seconds
    setTimeout(function () {
      // Remove the added class and revert the button color
      copyLinkButton.classList.remove('btn-copied');
      // Remove the message element
      messageElement.parentNode.removeChild(messageElement);
    }, 2000); // Adjust the time (in milliseconds) as needed
  }
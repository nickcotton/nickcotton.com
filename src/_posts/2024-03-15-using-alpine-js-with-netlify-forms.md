---
title: Using Alpine.js with Netlify Forms
toc:
date: 2024-03-15
categories:
---

I recently added a contact form to the home page of my site. Given that I was already using Alpine.js and Netlify, I decided to try and hook it up using the Netlify Forms feature. I ran into a couple of issues which I found confusing and poorly documented. This post is a helping hand to my future self.

Netlify Forms works by scanning your deploy for any forms and then added a hidden input field with the form name.

So a form authored like this:

```html
<form
  name="contact"
  method="POST"
  data-netlify="true">
  <p>
    <label for="name">Your name</label>
    <input id="name" name="name" type="text" />
  </p>
  <p>
    <label for="email">Your email</label>
    <input id="email" name="email" type="email" placeholder="test@example.com" />
  </p>
  <p class="font-sans text-xl col-span-2">
    <label for="message">Message</label>
    <textarea name="message"></textarea>
  </p>
</form>
```

Would be transformed to look like this:

```html
<form
  name="contact"
  method="POST"
  data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <p>
    <label for="name">Your name</label>
    <input id="name" name="name" type="text" />
  </p>
  <p>
    <label for="email">Your email</label>
    <input id="email" name="email" type="email" placeholder="test@example.com" />
  </p>
  <p class="font-sans text-xl col-span-2">
    <label for="message">Message</label>
    <textarea name="message"></textarea>
  </p>
  <button type="submit"></button>
</form>
```

With that working, I started to add in various attributes to collect the data and handle the form submission using Alpine, rather than a normal form submission. So my form now looks like this:

```html
<form
  name="contact"
  method="POST"
  data-netlify="true"
  @submit.prevent="submitForm">
  <p>
    <label for="name">Your name</label>
    <input x-model="formData.name" id="name" name="name" type="text" />
  </p>
  <p>
    <label for="email">Your email</label>
    <input x-model="formData.email" id="email" name="email" type="email" placeholder="test@example.com" />
  </p>
  <p class="font-sans text-xl col-span-2">
    <label for="message">Message</label>
    <textarea x-model="formData.message" name="message"></textarea>
  </p>
  <button type="submit"></button>
</form>
```

Here's the relevant snippet from the JS:

```js
function ContactForm() {
  return {
    formData: {
      name: "",
      email: "",
      message: "",
    },
    submitForm() {
      this.buttonState = "loading";

      const formData = new FormData();
      Object.keys(this.formData).forEach(key => {
        formData.append(key, this.formData[key]);
      });
      fetch(location.href, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      })
        .then(() => {
          this.buttonState = "success";
          this.formData.name = "";
          this.formData.email = "";
          this.formData.message = "";
        })
        .catch((e) => {
          this.buttonState = "error";
          console.error(e);
        })
        .finally(() => {
          setTimeout(() => {
            this.buttonState = "ready";
          }, 3000);
        })
    }
  }
}
```

Hmm, it's stopped working. When I submit the form now, the JS takes over but I get a 404 response in the devtools network tab.

After a bit of digging, I [discovered](https://answers.netlify.com/t/netlify-forms-with-vue-submit-prevent-handlesubmit/12325/30) that the service that manipulates the form on the Netlify side just bails out if it hits an invalid character (like an @).

So what if we just manually add the value of that hidden form field to the formData object that we send over to Netlify.

```diff-js
function ContactForm() {
  return {
    formData: {
      name: "",
      email: "",
      message: "",
+     "form-name": "contact",
    }
  }
}
```

Bingo! It works again.

I never discovered a great way to test this locally. It involved a lot of preview deployments and a few panicked pushed directly to main. If anyone *does* know how to do that, I'd love to hear!

# Publishing Your Capacitor App to the App Stores

Now that your Next.js application is wrapped as a Capacitor Mobile App, you are ready to share it with the world! Publishing an app requires you to use the native build tools provided by Apple and Google. 

Because we used the "Web Wrapper" approach, your app acts as a browser for `https://clausewala.in`. **Any time you update the website, the mobile app automatically updates.** You only need to follow this guide if you are publishing the app for the very first time, or if you change the App Name, App Icon, or Splash Screen.

## 🤖 Publishing to the Google Play Store (Android)

### Prerequisites:
1. A **Google Play Developer Account** ($25 one-time fee).
2. **Android Studio** installed on your computer.

### Step 1: Prepare Your App for Release
1. Open your terminal in your project directory (`D:\doc-fuge`) and run:
   ```bash
   npx cap open android
   ```
   This will open Android Studio. Wait for the initial "Gradle Sync" to finish indexing at the bottom of the window.

### Step 2: Generate a Signed Bundle
Android requires apps to be digitally signed before they can be uploaded to the Play Store.

1. In Android Studio, go to the top menu and select **Build > Generate Signed Bundle / APK...**
2. Select **Android App Bundle** (this is the modern format required by Google Play) and click **Next**.
3. Under "Key store path", if you don't have one, click **Create new...**.
   - Choose a safe place on your computer to save this `.jks` file. **Do not lose this file or the passwords you set!** You need it for all future updates.
   - Fill in the required fields (Password, Alias, Key Password, and at least one certificate field like First and Last Name). Click **OK**.
4. Click **Next**, choose the **release** destination folder, and click **Finish**.
5. Wait a few moments. Android Studio will generate an `.aab` file (usually in `android/app/release/app-release.aab`).

### Step 3: Upload to Google Play Console
1. Go to the [Google Play Console](https://play.google.com/console/) and click **Create app**.
2. Fill out the app details (Name, Default Language, App or Game, Free or Paid).
3. Under the "Testing" or "Production" track on the left sidebar, click **Create new release**.
4. Upload the `.aab` file you generated in Step 2.
5. Fill out the **Store Listing** information (App description, screenshots, privacy policy URL, etc.).
6. Click **Review** and then **Start rollout to Production**.

Your app will go into "In Review" status. Google usually takes 1-7 days to approve a new app.

---

## 🍏 Publishing to the Apple App Store (iOS)

**Important**: You *must* have a Mac computer to publish an iOS app. Apple does not allow iOS compilation on Windows or Linux.

### Prerequisites:
1. An **Apple Developer Account** ($99/year fee).
2. A **Mac computer** with **Xcode** installed from the Mac App Store.

### Step 1: Open Xcode
1. Transfer your project files to your Mac if you are currently on Windows.
2. In your terminal on the Mac, navigate to your project directory and run:
   ```bash
   npx cap open ios
   ```
   This opens your project in Xcode.

### Step 2: Configure App Identifiers & Signing
1. In Xcode, click your `App` project at the very top of the left sidebar.
2. Select the **App** target and go to the **Signing & Capabilities** tab.
3. Check the box for **"Automatically manage signing"**.
4. Log in to your Apple Developer account if prompted.
5. Select your Team from the dropdown menu. Xcode will automatically create the necessary certificates and provisioning profiles for you.
6. Go to the **General** tab and ensure your **Bundle Identifier** (e.g., `com.clausewala.app`) and **Version** numbers are correct.

### Step 3: Create an App Record in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/) and sign in.
2. Click **My Apps** > **+** > **New App**.
3. Select iOS, fill in your app's name, choose your primary language, and select the Bundle ID you verified in Xcode.
4. Fill out your App Store listing details, including screenshots and a privacy policy URL.

### Step 4: Archive and Upload
1. In Xcode, change your target device at the top center of the screen from a "Simulator" to **"Any iOS Device (arm64)"**.
2. From the top menu, select **Product > Archive**. Xcode will compile your app. This may take a few minutes.
3. Once finished, the "Archives" window will appear. Select your new archive and click the **Distribute App** button on the right.
4. Follow the prompts for **App Store Connect > Upload**. Xcode will securely upload your app to Apple's servers.

### Step 5: Submit for Review
1. Go back to your app's page in [App Store Connect](https://appstoreconnect.apple.com/).
2. Scroll down to the **Build** section and click the **+** button. You should see the build you just uploaded from Xcode (it might say "Processing" for 10-15 minutes). Select it.
3. Once all store listing details are completely filled out, click **Submit for Review** at the top right.

Apple typically reviews apps within 24-48 hours.

## Need to Make Changes?
Since we used the Web Wrapper approach, any changes you push to your Vercel codebase will instantly reflect in the app without going through this process again. This means you only need to go through the store review process *once*!

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var presence = new Presence({
    clientId: "463097721130188830",
    mediaKeys: false
}), strings = presence.getStrings({
    play: "presence.playback.playing",
    pause: "presence.playback.paused",
    live: "presence.activity.live"
});
var pattern = "•";
function truncateAfter(str, pattern) {
    return str.slice(0, str.indexOf(pattern));
}
presence.on("UpdateData", () => __awaiter(this, void 0, void 0, function* () {
    var video = document.querySelector(".video-stream");
    if (video !== null && !isNaN(video.duration)) {
        var oldYouTube = null, YouTubeTV = null, YouTubeEmbed = null, title;
        document.querySelector(".watch-title") !== null
            ? (oldYouTube = true)
            : (oldYouTube = false);
        document.querySelector(".player-video-title") !== null
            ? (YouTubeTV = true)
            : (YouTubeTV = false);
        document.location.pathname.includes("/embed")
            ? (YouTubeEmbed = true)
            : (YouTubeEmbed = false);
        YouTubeEmbed
            ? (title = document.querySelector("div.ytp-title-text > a"))
            : oldYouTube && document.location.pathname.includes("/watch")
                ? (title = document.querySelector(".watch-title"))
                : YouTubeTV
                    ? (title = document.querySelector(".player-video-title"))
                    : !document.location.pathname.includes("/watch")
                        ? (title = document.querySelector(".ytd-miniplayer .title"))
                        : (title = document.querySelector("h1 yt-formatted-string.ytd-video-primary-info-renderer"));
        var uploaderTV, uploaderMiniPlayer, uploader2, edited, uploaderEmbed;
        (edited = false),
            (uploaderTV =
                document.querySelector(".player-video-details") ||
                    document.querySelector("ytd-video-owner-renderer  .ytd-channel-name")),
            (uploaderEmbed = document.querySelector("div.ytp-title-expanded-heading > h2 > a")),
            (uploaderMiniPlayer = document.querySelector("yt-formatted-string#owner-name")),
            (uploader2 = document.querySelector("#owner-name a"));
        if (uploaderMiniPlayer != null &&
            uploaderMiniPlayer.textContent == "YouTube") {
            edited = true;
            uploaderMiniPlayer.setAttribute("premid-value", "Listening to a playlist");
        }
        var uploader = uploaderMiniPlayer !== null && uploaderMiniPlayer.textContent.length > 0
            ? uploaderMiniPlayer
            : uploader2 !== null && uploader2.textContent.length > 0
                ? uploader2
                : document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a") !== null
                    ? document.querySelector("#upload-info yt-formatted-string.ytd-channel-name a")
                    : uploaderEmbed !== null &&
                        YouTubeEmbed &&
                        uploaderEmbed.textContent.length > 0
                        ? uploaderEmbed
                        : (uploaderTV = truncateAfter(uploaderTV.textContent.replace(/\s+/g, ""), pattern));
        var timestamps = getTimestamps(Math.floor(video.currentTime), Math.floor(video.duration));
        var live = Boolean(document.querySelector(".ytp-live")), ads = Boolean(document.querySelector(".ytp-ad-player-overlay"));
        var presenceData = {
            details: title.textContent.replace(/\s+/g, "") == ""
                ? document.querySelector("div.ytp-title-text > a").textContent
                : title.textContent,
            state: edited == true
                ? uploaderMiniPlayer.getAttribute("premid-value")
                : uploaderTV !== null
                    ? uploaderTV.textContent
                    : uploader.textContent,
            largeImageKey: "yt_lg",
            smallImageKey: video.paused ? "pause" : "play",
            smallImageText: video.paused
                ? (yield strings).pause
                : (yield strings).play,
            startTimestamp: timestamps[0],
            endTimestamp: timestamps[1]
        };
        presence.setTrayTitle(video.paused
            ? ""
            : title == null
                ? document.querySelector(".title.style-scope.ytd-video-primary-info-renderer").textContent
                : title.textContent);
        if (video.paused || live) {
            delete presenceData.startTimestamp;
            delete presenceData.endTimestamp;
            if (live) {
                presenceData.smallImageKey = "live";
                presenceData.smallImageText = (yield strings).live;
            }
        }
        if (title == null &&
            document.querySelector(".title.style-scope.ytd-video-primary-info-renderer") !== null) {
            presenceData.details = document.querySelector(".title.style-scope.ytd-video-primary-info-renderer").textContent;
        }
        if (uploader == null &&
            document.querySelector(".style-scope.ytd-channel-name > a") !== null) {
            presenceData.state = document.querySelector(".style-scope.ytd-channel-name > a").textContent;
        }
        if (ads) {
            presenceData.details = "Currently watching an ad";
            delete presenceData.state;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
    else if (document.location.hostname == "www.youtube.com" ||
        document.location.hostname == "youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/results")) {
            search = document.querySelector("#search-input > div > div:nth-child(2) > input");
            if (search == null) {
                search = document.querySelector("#search-input > input");
            }
            presenceData.details = "Searching for:";
            presenceData.state = search.value;
            presenceData.smallImageKey = "search";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel") ||
            document.location.pathname.includes("/user")) {
            if (document.querySelector("#text.ytd-channel-name") &&
                document.title
                    .substr(0, document.title.lastIndexOf(" - YouTube"))
                    .includes(document.querySelector("#text.ytd-channel-name").textContent)) {
                user = document.querySelector("#text.ytd-channel-name").textContent;
            }
            else if (/\(([^)]+)\)/.test(document.title.substr(0, document.title.lastIndexOf(" - YouTube")))) {
                user = document.title
                    .substr(0, document.title.lastIndexOf(" - YouTube"))
                    .replace(/\(([^)]+)\)/, "");
            }
            else {
                user = document.title.substr(0, document.title.lastIndexOf(" - YouTube"));
            }
            if (user.replace(/\s+/g, "") == "" || user.replace(/\s+/g, "") == "‌")
                user = "null";
            if (document.location.pathname.includes("/videos")) {
                presenceData.details = "Browsing through videos";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/playlists")) {
                presenceData.details = "Browsing through playlists";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/community")) {
                presenceData.details = "Viewing community posts";
                presenceData.state = "of : " + user;
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/about")) {
                presenceData.details = "Reading about channel:";
                presenceData.state = user;
                presenceData.smallImageKey = "reading";
                presenceData.startTimestamp = browsingStamp;
            }
            else if (document.location.pathname.includes("/search")) {
                search = document.URL.split("search?query=")[1];
                presenceData.details = "Searching through channel: " + user;
                presenceData.state = "for: " + search;
                presenceData.smallImageKey = "search";
                presenceData.startTimestamp = browsingStamp;
            }
            else {
                presenceData.details = "Viewing channel:";
                presenceData.state = user;
                presenceData.startTimestamp = browsingStamp;
            }
        }
        else if (document.location.pathname.includes("/feed/trending")) {
            presenceData.details = "Viewing what's trending";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/subscriptions")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their subscriptions";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/library")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their library";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/history")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/feed/purchases")) {
            presenceData.details = "Browsing through";
            presenceData.state = "their purchases";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/playlist")) {
            presenceData.details = "Viewing playlist:";
            title = document.querySelector("#text-displayed");
            if (title == null) {
                title = document.querySelector("#title > yt-formatted-string > a");
            }
            presenceData.state = title.textContent;
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/premium")) {
            presenceData.details = "Reading about";
            presenceData.state = "Youtube Premium";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/gaming")) {
            presenceData.details = "Browsing through";
            presenceData.state = "Youtube Gaming";
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/account")) {
            presenceData.details = "Viewing their account";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/reporthistory")) {
            presenceData.details = "Viewing their report history";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/intl")) {
            presenceData.details = "Reading about:";
            presenceData.state = document.title.substr(0, document.title.lastIndexOf(" - YouTube"));
            presenceData.smallImageKey = "reading";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.URL == "https://www.youtube.com/") {
            presenceData.details = "Browsing the main page...";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/upload")) {
            presenceData.details = "Uploading something...";
            presenceData.startTimestamp = browsingStamp;
            presenceData.smallImageKey = "writing";
        }
        else if (document.location.pathname.includes("/view_all_playlists")) {
            presenceData.details = "Viewing all their playlists";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/my_live_events")) {
            presenceData.details = "Viewing their live events";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/live_dashboard")) {
            presenceData.details = "Viewing their live dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/audiolibrary")) {
            presenceData.details = "Viewing the audio library";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
    else if (document.location.hostname == "studio.youtube.com") {
        let presenceData = {
            largeImageKey: "yt_lg",
            smallImageKey: "studio",
            smallImageText: "Youtube Studio"
        };
        var search;
        var user;
        var browsingStamp = Math.floor(Date.now() / 1000);
        if (document.location.pathname.includes("/videos")) {
            presenceData.details = "Viewing their videos";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/video")) {
            title = document.querySelector("#entity-name");
            presenceData.startTimestamp = browsingStamp;
            if (document.location.pathname.includes("/edit")) {
                presenceData.details = "Editing video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/analytics")) {
                presenceData.details = "Viewing analytics of video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/comments")) {
                presenceData.details = "Viewing comments of video:";
                presenceData.state = title.textContent;
            }
            else if (document.location.pathname.includes("/translations")) {
                presenceData.details = "Viewing translations of video:";
                presenceData.state = title.textContent;
            }
        }
        else if (document.location.pathname.includes("/analytics")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel analytics";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/comments")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel comments";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/translations")) {
            presenceData.details = "Viewing their";
            presenceData.state = "channel translations";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/channel")) {
            presenceData.details = "Viewing their dashboard";
            presenceData.startTimestamp = browsingStamp;
        }
        else if (document.location.pathname.includes("/artist")) {
            presenceData.details = "Viewing their";
            presenceData.state = "artist page";
            presenceData.startTimestamp = browsingStamp;
        }
        if (presenceData.details == null) {
            presence.setTrayTitle();
            presence.setActivity();
        }
        else {
            presence.setActivity(presenceData);
        }
    }
}));
function getTimestamps(videoTime, videoDuration) {
    var startTime = Date.now();
    var endTime = Math.floor(startTime / 1000) - videoTime + videoDuration;
    return [Math.floor(startTime / 1000), endTime];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlc2VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9wcmVzZW5jZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxJQUFJLFFBQVEsR0FBRyxJQUFJLFFBQVEsQ0FBQztJQUN4QixRQUFRLEVBQUUsb0JBQW9CO0lBQzlCLFNBQVMsRUFBRSxLQUFLO0NBQ2pCLENBQUMsRUFDRixPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUM1QixJQUFJLEVBQUUsMkJBQTJCO0lBQ2pDLEtBQUssRUFBRSwwQkFBMEI7SUFDakMsSUFBSSxFQUFFLHdCQUF3QjtDQUMvQixDQUFDLENBQUM7QUFHTCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDbEIsU0FBUyxhQUFhLENBQUMsR0FBRyxFQUFFLE9BQU87SUFDakMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUVELFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQVMsRUFBRTtJQUVuQyxJQUFJLEtBQUssR0FBcUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUN0RSxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzVDLElBQUksVUFBVSxHQUFZLElBQUksRUFDNUIsU0FBUyxHQUFZLElBQUksRUFDekIsWUFBWSxHQUFZLElBQUksRUFDNUIsS0FBVSxDQUFDO1FBR2IsUUFBUSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsS0FBSyxJQUFJO1lBQzdDLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDckIsQ0FBQyxDQUFDLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRXpCLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFC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
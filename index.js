/**
 * @file Serves as a base with reusable functions for Chromium browsers such as Google Chrome, Opera, and Yandex.
 * @author Linus Långberg
 */

const path = require('path')
const sqlite3 = require('sqlite3').verbose()

/**
 * Returns saved login data from a specified Chromium web browser.
 * @param {String} browser The browser to retrieve login data from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information such as origin, username, and password.
 * @param {String} [loginDataFilePath] Path for login data, only necessary if your browser's login data does not reside in its default location.
 * @returns {Object[]} An array of objects containing info about accounts.
 */
exports.getLoginData = function (browser, limited, loginDataFilePath) {
  if (!loginDataFilePath) loginDataFilePath = getBrowserFilePath(browser, 'Login Data')

  const db = new sqlite3.Database(loginDataFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)

      return
    }

    db.all('SELECT * FROM logins', function (error, rows) {
      if (error) {
        console.error(error)

        return
      }

      let loginData = []

      for (let index = 0; index < rows.length; index++) {
        var row = rows[index]

        if (limited) {
          loginData.push({
            originUrl: row.origin_url,
            username: row.username_value,
            password: row.password_value
          })
        } else {
          loginData.push(row)
        }
      }

      console.log(loginData)
    })

    db.close()
  })
}

/**
 * Returns saved login data from a specified Chromium web browser using SQLite3's built-in each() function. Keep in mind that this is generally much slower compared to the original function.
 * @param {String} browser The browser to retrieve login data from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information such as origin, username, and password.
 * @param {String} [loginDataFilePath] Path for login data, only necessary if your browser's login data does not reside in its default location.
 * @returns {Object[]} An array of objects containing info about accounts.
 */
exports.getLoginDataEach = function (browser, limited, loginDataFilePath) {
  if (!loginDataFilePath) loginDataFilePath = getBrowserFilePath(browser, 'Login Data')

  const db = new sqlite3.Database(loginDataFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)

      return
    }

    let loginData = []

    db.each('SELECT * FROM logins', function (error, row) {
      if (error) {
        console.error(error)

        return
      }

      if (limited) {
        loginData.push({
          originUrl: row.origin_url,
          username: row.username_value,
          password: row.password_value
        })
      } else {
        loginData.push(row)
      }

      console.log(loginData)
    })

    db.close()
  })
}

/**
 * Returns saved cookies from a specified Chromium web browser.
 * @param {String} browser The browser to retrieve cookies from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information.
 * @param {String} [cookiesFilePath] Path for cookies file, only necessary if your browser's cookies file does not reside in its default location.
 * @returns {Object[]} An array of objects containing cookie info.
 */
exports.getCookies = function (browser, limited, cookiesFilePath) {
  if (!cookiesFilePath) cookiesFilePath = getBrowserFilePath(browser, 'Cookies')

  const db = new sqlite3.Database(cookiesFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)
      
      return
    }

    db.all('SELECT * FROM cookies', function (error, rows) {
      if (error) {
        console.error(error)

        return
      }

      let cookies = []      

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index]

        if (limited) {
          cookies.push({
            hostKey: row.host_key,
            name: row.name,
            value: row.encrypted_value,
            path: row.path,
            expiresUtc: row.expires_utc,
            secure: Boolean(row.secure),
            httpOnly: Boolean(row.httponly),
            lastAccessUtc: row.last_access_utc,
            expired: Boolean(row.has_expires),
            persistent: Boolean(row.persistent),
            priority: Boolean(row.priority)
          })
        } else {
          cookies.push(row)
        } 
      }

      console.log(cookies)
    })

    db.close()
  })
}

/**
 * Returns saved cookies from a specified Chromium web browser using SQLite3's built-in each() function. Keep in mind that this is generally much slower compared to the original function.
 * @param {String} browser The browser to retrieve cookies from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information.
 * @param {String} [cookiesFilePath] Path for cookies file, only necessary if your browser's cookies file does not reside in its default location.
 * @returns {Object[]} An array of objects containing cookie info.
 */
exports.getCookiesEach = function (browser, limited, cookiesFilePath) {
  if (!cookiesFilePath) cookiesFilePath = getBrowserFilePath(browser, 'Cookies')

  const db = new sqlite3.Database(cookiesFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)
      
      return
    }

    let cookies = []

    db.each('SELECT * FROM cookies', function (error, row) {
      if (error) {
        console.error(error)

        return
      }

      if (limited) {
        cookies.push({
          hostKey: row.host_key,
          name: row.name,
          value: row.encrypted_value,
          path: row.path,
          expiresUtc: row.expires_utc,
          secure: Boolean(row.secure),
          httpOnly: Boolean(row.httponly),
          lastAccessUtc: row.last_access_utc,
          expired: Boolean(row.has_expires),
          persistent: Boolean(row.persistent),
          priority: Boolean(row.priority)
        })
      } else {
        cookies.push(row)
      }

      console.log(cookies)
    })

    db.close()
  })
}

/**
 * Returns the history of visited web pages from a specified Chromium web browser.
 * @param {String} browser The browser to retrieve the history from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information.
 * @param {String} [historyFilePath] Path for history file, only necessary if your browser's history file does not reside in its default location.
 * @returns {Object[]} An array of objects containing info about the URL history.
 */
exports.getUrlHistory = function (browser, limited, historyFilePath) {
  if (!historyFilePath) historyFilePath = getBrowserFilePath(browser, 'History')

  const db = new sqlite3.Database(historyFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)

      return
    }

    db.all('SELECT * FROM urls', function (error, rows) {
      if (error) {
        console.error(error)

        return
      }

      let history = []

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index];
        
        if (limited) {
          history.push({
            id: row.id,
            url: row.url,
            title: row.title,
            visits: row.visit_count,
            lastVisit: row.last_visit_time
          })
        } else {
          history.push(row)
        }
      }

      console.log(history)
    })

    db.close()
  })
}

/**
 * Returns the history of downloaded files from a specified Chromium web browser.
 * @param {String} browser The browser to retrieve the history from, keep in mind that the browser must use the Chromium storage facility.
 * @param {Boolean} [limited] Whether or not to return only important information.
 * @param {String} [historyFilePath] Path for history file, only necessary if your browser's history file does not reside in its default location.
 * @returns {Object[]} An array of objects containing info about the download history.
 */
exports.getDownloadHistory = function (browser, limited, historyFilePath) {
  if (!historyFilePath) historyFilePath = getBrowserFilePath(browser, 'History')

  const db = new sqlite3.Database(historyFilePath, sqlite3.OPEN_READONLY, function (error) {
    if (error) {
      console.error(error)

      return
    }

    db.all('SELECT * FROM downloads', function (error, rows) {
      if (error) {
        console.error(error)

        return
      }

      let downloadHistory = []

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index];
        
        if (limited) {
          downloadHistory.push({
            id: row.id,
            guid: row.guid,
            currentPath: row.current_path,
            targetPath: row.target_path,
            totalBytes: row.total_bytes,
            referrer: row.referrer,
            siteUrl: row.site_url,
            tabUrl: row.tab_url,
            mimeType: row.mime_type
          })
        } else {
          downloadHistory.push(row)
        }
      }

      console.log(downloadHistory)
    })
  })
}

/**
 * Returns a string containing the full path to a file associated with the specified browser.
 * @param {String} browser The browser you want to look for in the file system.
 * @param {String} fileName The file name that you want, the suffix in the full path, may look like: "Login Data" or "Cookies".
 * @returns {String} The full path to the respective browser file.
 * @private
 */
function getBrowserFilePath(browser, fileName) {
  if (browser === 'chrome') {
    return path.join(process.env.LOCALAPPDATA, '\\Google\\Chrome\\User Data\\Default\\', fileName)
  }
  
  if (browser === 'opera') {
    return path.join(process.env.LOCALAPPDATA, '\\Opera Software\\Opera Stable\\', fileName)
  }

  if (browser === 'yandex') {
    return path.join(process.env.LOCALAPPDATA, '\\Yandex\\YandexBrowser\\User Data\\Default\\', fileName)
  }

  return
}
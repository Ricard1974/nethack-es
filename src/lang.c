/* NetHack-es: language detection for i18n */
#include "config.h"
#include "tradstdc.h"
#include <stdio.h>
#include <string.h>
#include <ctype.h>

static char current_lang[3] = "en"; /* default: English */

/* init_lang: detect language from LANG environment variable */
void init_lang(void)
{
    const char *env = nh_getenv("LANG");
    if (env && strlen(env) >= 2 && isalpha((int)env[0])
        && isalpha((int)env[1])) {
        current_lang[0] = tolower((int)env[0]);
        current_lang[1] = tolower((int)env[1]);
        current_lang[2] = '\0';
        /* For now, only "es" gets Spanish; everything else is English */
        if (strcmp(current_lang, "es") != 0
            && strcmp(current_lang, "en") != 0)
            strcpy(current_lang, "en");
    } else {
        strcpy(current_lang, "en");
    }
}

/* get_lang: return the two-letter language code */
const char *get_lang(void)
{
    return current_lang;
}

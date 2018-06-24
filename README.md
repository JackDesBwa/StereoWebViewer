StereoWebViewer
===============

Web viewer to display stereo photos for different viewing methods

Status
------

Proof of concept — It is working but has to be improved for better usability.

Purpose
-------

This project aims to provide a free (to use) viewer to display stereo photo content on websites, without having to generate one image per viewing method.

Input
-----

Input images can be :
Parallel (`p`) or cross (`x`) pair of photographs regrouped side by side in one image

The input mode is set by `data-swv-format` attribute in `img` node of html document.

Output
------

Supported output are :

* Parallel view (`p`)
* Cross view (`x`)
* Anaglyph (`a`) [Dubois color merging method is used]
* interleaved (`i`) [Not tested on actual device yet]
* Left-only (`l`)
* Right only (`r`)

The ouput mode is set by clicking on the image (so that it has focus) and pressing the associated key (e.g. `a` for anaglyph).

API
---

At the time of writing, only automatic convertion is supported: all images whose `img` node has attribute `data-swv-auto="1"` are replaced by viewer version if the browser supports it.

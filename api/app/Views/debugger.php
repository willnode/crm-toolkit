<?php

use Config\Services;

$request = Services::request();

?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title><?= $request->uri->getPath() ?></title>
  <meta name="description" content="The small framework with powerful features">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link defer rel="stylesheet" href="<?= base_url('assets/bootstrap.min.css') ?>">
  <link defer rel="stylesheet" href="<?= base_url('assets/highlighter.min.css') ?>">
  <script defer src="<?= base_url('assets/highlighter.min.js') ?>"></script>
</head>

<body>
  <div class="container-fluid">
    <h1 class="my-2 text-center"><?= $json['status'] ?></h1>
    <div class="row">
      <div class="col-md-5 col-lg-4 col-xl-3">
        <?php if (isset($json['status'])) : ?>
        <?php endif ?>
        <?php if (isset($json['routes'])) : ?>
          <h2>Available Routes</h2>
          <ul>
            <?php foreach ($json['routes'] as $route) : ?>
              <li><a href="<?= base_url($route) ?>/"><?= $route ?></a></li>
            <?php endforeach ?>
          </ul>
        <?php endif ?>
        <?php if (isset($model)) : ?>
          <?php $metadata = $model->getMetadata() ?>
          <div class="text-center">
            <h2><?= basename(str_replace('\\', '/', $metadata->name)) ?></h2>
            <p>Object-ID: <b><?= $metadata->id ?? 'NULL' ?></b>
              <a class="btn btn-sm btn-secondary" href="<?= base_url(dirname($request->uri->getPath())) ?>/">Up</a> &bullet;
              Method: <b><?= strtoupper($metadata->method) ?></b></p>
            <p>What do you want to do?</p>
            <?php if ($metadata->method !== GET) : ?>
              <a href="<?= preg_replace('/\?delete=y$/', '/', $request->uri->getPath()) ?>">Back to GET</a>
            <?php elseif ($metadata->id === NULL) : ?>
              <details>
                <summary>Setup QUERY</summary>
                <?php $query = $metadata->query ?>
                <form class="my-2" name="query">
                  <?php if ($query['canSearch']) : ?>
                    <input type="checkbox" <?= isset($query['search']) ? 'checked' : '' ?> onchange="window.query.search.disabled = !event.target.checked">
                    <input type="text" placeholder="search" title="search" name="search" <?= !isset($query['search']) ? 'disabled' : '' ?> value="<?= esc($query['search'] ?? '') ?>">
                    <br>
                    <input type="submit">
                  <?php endif ?>
                </form>
              </details>
              <details>
                <summary>READ specific item</summary>
                <p class="my-2">ID <input type="number" onkeydown="if (event.keyCode === 13) window.location = './'+event.target.value"></p>
              </details>
              <details>
                <summary>CREATE an item</summary>
                <form method="POST" class="my-2">
                  <?php foreach ($metadata->fields as $key => $value) : ?>
                    <input placeholder="<?= $key ?>" title="<?= $key ?>" class="form-control h-auto" name="<?= $key ?>" type="<?= $value ?>">
                  <?php endforeach ?>
                  <p><input type="submit"></p>
                </form>
              </details>
            <?php else : ?>

              <details>
                <summary>Get files of this item</summary>
                <form method="POST" class="my-1">
                  <?php foreach ($metadata->files as $key => $value) : ?>
                    <p class="my-2">
                      <a class="btn btn-secondary btn-sm" href="<?= base_url('uploads/' . ($value['folder'] ?? $key) . '/' . $json['data'][$key] ?? '') ?>">
                        <?= $key ?>
                      </a>
                      <input type="submit" class="btn btn-danger btn-sm" name="<?= $key ?>_delete" tooltip="Delete" value="&times;">
                    </p>
                  <?php endforeach ?>
                </form>
              </details>
              <details>
                <summary>DELETE this item</summary>
                <p class="my-2">
                  <form><input type="hidden" name="delete" value="y"><input type="submit" class="btn btn-danger btn-sm" value="Delete"></form>
                </p>
              </details>
              <details>
                <summary>UPDATE this item</summary>
                <form method="POST" enctype="multipart/form-data" class="my-2">
                  <?php foreach ($metadata->fields as $key => $value) : ?>
                    <input placeholder="<?= $key ?>" title="<?= $key ?>" class="form-control form-control-sm h-auto my-1" name="<?= $key ?>" type="<?= $value ?>" value="<?=
                      isset($json['data'][$key]) && !is_array($json['data'][$key]) &&  !is_object($json['data'][$key]) ? esc($json['data'][$key] ?? '', 'attr') : ''?>">
                  <?php endforeach ?>
                  <p><input type="submit" class="btn btn-primary btn-sm"></p>
                </form>
              </details>
            <?php endif ?>
          </div>
        <?php endif ?>
      </div>
      <div class="col-md-7 col-lg-8 col-xl-9">
        <pre><code class="json"><?= json_encode($json, JSON_PRETTY_PRINT) ?></code></pre>
        <p><small>This HTML only appears during development. A minified response of above JSON will returned instead in AJAX request or production environment</small></p>
      </div>
    </div>
    <script>
      window.addEventListener('load', (event) => {
        hljs.initHighlighting();
      });
    </script>
  </div>
</body>

</html>
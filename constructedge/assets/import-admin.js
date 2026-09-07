/**
 * Dashboard import button handler.
 *
 * Posts to admin-ajax.php (action=constructedge_import) and reports progress.
 */
(function ($) {
  'use strict';

  $(function () {
    var $btn = $('#constructedge-import-btn');
    var $status = $('#constructedge-import-status');

    if (!$btn.length) {
      return;
    }

    $btn.on('click', function () {
      $btn.prop('disabled', true).text('Importing…');
      $status.text('This can take a moment.').css('color', '#646970');

      $.post(
        window.constructedgeImport.ajaxUrl,
        {
          action: 'constructedge_import',
          nonce: $btn.data('nonce')
        }
      )
        .done(function (res) {
          if (res && res.success) {
            $status.text('✓ ' + res.data.message).css('color', '#00a32a');
            $('#constructedge-import-notice').fadeOut(800);
          } else {
            $status.text('✕ ' + (res && res.data ? res.data.message : 'Import failed.')).css('color', '#d63638');
            $btn.prop('disabled', false).text('Try again');
          }
        })
        .fail(function () {
          $status.text('✕ Request failed.').css('color', '#d63638');
          $btn.prop('disabled', false).text('Try again');
        });
    });
  });
})(jQuery);

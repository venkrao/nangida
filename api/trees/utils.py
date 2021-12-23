from nangida.settings import TREE_PHOTOS


def tree_upload_handler(instance, filename):
    filepath = '{}/{}_${}'.format(TREE_PHOTOS, instance.tree_id.tree_id, filename)
    return filepath



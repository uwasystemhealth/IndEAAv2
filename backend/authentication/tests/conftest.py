import pytest


@pytest.fixture
def use_simulated_root_urlconf(settings) -> None:
    """ Overwrite to use the simulated root urlconf
    """
    settings.ROOT_URLCONF = 'authentication.tests.test_permissions_synthethic'

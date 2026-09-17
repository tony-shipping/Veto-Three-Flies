import unittest
from senses.scent import scent, clamp


class TestScent(unittest.TestCase):
    def setUp(self):
        self.base_launch = {
            "id": "test-launch-01",
            "ticker": "TESTFLY",
            "pair": "0x123",
            "created_ts": 1716000000,
            "age_s": 700,
            "unique_wallets": 45,
            "volume_eth": 6.0,
            "creator_pct": 0.05,
            "top_holder_pct": 0.05,
            "mint_open": False,
            "in_snipe_window": False,
        }

    def test_deterministic_identical_launch(self):
        """Одинаковый Launch -> одинаковый scent."""
        s1 = scent(self.base_launch)
        s2 = scent(self.base_launch)
        s3 = scent(dict(self.base_launch))
        self.assertEqual(s1, s2)
        self.assertEqual(s2, s3)
        self.assertIsInstance(s1, float)

    def test_clamp_boundaries(self):
        """Проверка границ clamp: значение всегда в пределах 0.0 .. 1.0."""
        # Extreme negative/zero
        zero_launch = {
            "age_s": 0,
            "unique_wallets": 0,
            "volume_eth": 0.0,
            "top_holder_pct": 1.0,
            "in_snipe_window": True,
        }
        s_zero = scent(zero_launch)
        self.assertGreaterEqual(s_zero, 0.0)
        self.assertLessEqual(s_zero, 1.0)
        self.assertEqual(s_zero, 0.0)

        # Extreme positive
        extreme_launch = {
            "age_s": 999999,
            "unique_wallets": 10000,
            "volume_eth": 1000.0,
            "top_holder_pct": 0.0,
            "in_snipe_window": False,
        }
        s_extreme = scent(extreme_launch)
        self.assertEqual(s_extreme, 1.0)

    def test_snipe_window_zeroes_age_factor(self):
        """Антиснайп-окно обнуляет возрастной фактор."""
        l_snipe = dict(self.base_launch)
        l_snipe["in_snipe_window"] = True
        s_snipe = scent(l_snipe)
        s_normal = scent(self.base_launch)
        self.assertLess(s_snipe, s_normal)

    def test_concentration_penalty(self):
        """Высокая концентрация у топ-холдера снижает scent."""
        l_distributed = dict(self.base_launch)
        l_distributed["top_holder_pct"] = 0.02

        l_concentrated = dict(self.base_launch)
        l_concentrated["top_holder_pct"] = 0.30

        self.assertGreater(scent(l_distributed), scent(l_concentrated))


if __name__ == "__main__":
    unittest.main()

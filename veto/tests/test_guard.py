import unittest
from flies import guard, hunter, scout


class TestGuardAndHunter(unittest.TestCase):
    def setUp(self):
        self.clean_launch = {
            "id": "clean-launch-99",
            "ticker": "GOODFLY",
            "pair": "0x9999",
            "created_ts": 1716000000,
            "age_s": 700,
            "unique_wallets": 50,
            "volume_eth": 6.5,
            "creator_pct": 0.05,
            "top_holder_pct": 0.05,
            "mint_open": False,
            "in_snipe_window": False,
        }
        self.valid_scent = 0.85

    def test_clean_pass(self):
        """Чистый PASS при отсутствии нарушений и высоком scent."""
        res = guard.evaluate(self.clean_launch, self.valid_scent)
        self.assertEqual(res["action"], "PASS")
        self.assertIsNone(res["why"])

    def test_veto_snipe_window(self):
        """Вето 1: in_snipe_window -> 'snipe window'."""
        l = dict(self.clean_launch, in_snipe_window=True)
        res = guard.evaluate(l, self.valid_scent)
        self.assertEqual(res["action"], "REFUSED")
        self.assertEqual(res["why"], "snipe window")

    def test_veto_creator_pct(self):
        """Вето 2: creator_pct > 0.15 -> 'creator'."""
        l = dict(self.clean_launch, creator_pct=0.19)
        res = guard.evaluate(l, self.valid_scent)
        self.assertEqual(res["action"], "REFUSED")
        self.assertEqual(res["why"], "creator")

    def test_veto_mint_open(self):
        """Вето 3: mint_open -> 'mint'."""
        l = dict(self.clean_launch, mint_open=True)
        res = guard.evaluate(l, self.valid_scent)
        self.assertEqual(res["action"], "REFUSED")
        self.assertEqual(res["why"], "mint")

    def test_veto_own_names(self):
        """Вето 4: ticker ∈ {VETO, EL VETO, FLYVETO} -> 'own name'."""
        for ticker in ["VETO", "EL VETO", "FLYVETO", " veto ", "$VETO", "El Veto"]:
            l = dict(self.clean_launch, ticker=ticker)
            res = guard.evaluate(l, self.valid_scent)
            self.assertEqual(res["action"], "REFUSED")
            self.assertEqual(res["why"], "own name")

    def test_veto_flat_scent(self):
        """Вето 5: scent < 0.60 -> 'flat scent'."""
        res = guard.evaluate(self.clean_launch, 0.59)
        self.assertEqual(res["action"], "REFUSED")
        self.assertEqual(res["why"], "flat scent")

    def test_veto_priority_order(self):
        """Приоритет проверок: первое правило имеет высший приоритет."""
        # Одновременно in_snipe_window и creator > 0.15 -> первое должно быть 'snipe window'
        l_snipe_and_creator = dict(self.clean_launch, in_snipe_window=True, creator_pct=0.25)
        res = guard.evaluate(l_snipe_and_creator, self.valid_scent)
        self.assertEqual(res["why"], "snipe window")

        # Одновременно creator > 0.15 и mint_open -> 'creator'
        l_creator_and_mint = dict(self.clean_launch, creator_pct=0.20, mint_open=True)
        res = guard.evaluate(l_creator_and_mint, self.valid_scent)
        self.assertEqual(res["why"], "creator")

    def test_hunter_idle_on_refused(self):
        """Hunter IDLE при любом REFUSED."""
        veto_reasons = ["snipe window", "creator", "mint", "own name", "flat scent"]
        for reason in veto_reasons:
            decision = {
                "launch_id": "test-1",
                "ticker": "TEST",
                "guard": "REFUSED",
                "why": reason,
                "mode": "paper",
            }
            h_res = hunter.evaluate(decision)
            self.assertEqual(h_res["action"], "IDLE")
            self.assertIsNone(h_res["size_eth"])

    def test_hunter_landed_on_pass_and_paper(self):
        """Hunter LANDED только если guard=PASS и mode=paper (size=0.04 ETH)."""
        decision_paper_pass = {
            "launch_id": "test-pass",
            "ticker": "GOODFLY",
            "guard": "PASS",
            "why": None,
            "mode": "paper",
        }
        h_res = hunter.evaluate(decision_paper_pass)
        self.assertEqual(h_res["action"], "LANDED")
        self.assertEqual(h_res["size_eth"], 0.04)

    def test_hunter_not_landed_if_mode_not_paper(self):
        """Hunter не пишет LANDED если mode != paper."""
        for non_paper_mode in ["live", "testnet", "simulation", None]:
            decision = {
                "launch_id": "test-pass",
                "ticker": "GOODFLY",
                "guard": "PASS",
                "why": None,
                "mode": non_paper_mode,
            }
            h_res = hunter.evaluate(decision)
            self.assertEqual(h_res["action"], "IDLE")
            self.assertIsNone(h_res["size_eth"])

    def test_hunter_no_duplicate_landing(self):
        """Hunter не садится повторно на уже купленный launch_id в цикле."""
        decision = {
            "launch_id": "already-bought-01",
            "ticker": "GOODFLY",
            "guard": "PASS",
            "why": None,
            "mode": "paper",
        }
        already_landed = {"already-bought-01"}
        h_res = hunter.evaluate(decision, already_landed_ids=already_landed)
        self.assertEqual(h_res["action"], "IDLE")
        self.assertIsNone(h_res["size_eth"])


if __name__ == "__main__":
    unittest.main()
